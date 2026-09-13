/**
 * Water Droplet Signed Distance Field (SDF) Normal Map Generator
 * Generates an optical displacement and caustic specular map for real liquid refraction.
 *
 * Channels:
 * - Red (R): Horizontal displacement dX (128 = neutral)
 * - Green (G): Vertical displacement dY (128 = neutral)
 * - Blue (B): Specular caustic & highlight mask (128 = neutral, 255 = maximum glint)
 * - Alpha (A): Anti-aliased droplet contour shape mask
 */

export interface DropletMapParams {
  width: number;
  height: number;
  radius: number;
  curvature?: number; // Convex dome intensity (0 to 2)
  bend?: number; // Meniscus surface-tension lip intensity (0 to 2)
  bendWidth?: number; // Width of meniscus rim as fraction of min(W,H) (0.05 to 0.35)
  specularAngle?: number; // Degrees (45 = top-left light source)
  specularIntensity?: number; // 0 to 2
}

function length(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

function roundedRectSDF(
  x: number,
  y: number,
  halfW: number,
  halfH: number,
  radius: number,
): number {
  const qx = Math.abs(x) - halfW + radius;
  const qy = Math.abs(y) - halfH + radius;
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  return Math.min(Math.max(qx, qy), 0) + length(ox, oy) - radius;
}

// LRU cache for displacement maps — containers with identical params share one map
const MAP_CACHE_MAX = 16;
const mapCache = new Map<string, string>();

export function generateLiquidDropletMap(params: DropletMapParams): string {
  if (typeof document === 'undefined') return '';

  const {
    width,
    height,
    radius,
    curvature = 1.6,
    bend = 1.2,
    bendWidth = 0.2,
    specularAngle = 45,
    specularIntensity = 1.5,
  } = params;

  const w = Math.round(width);
  const h = Math.round(height);
  if (w <= 0 || h <= 0) return '';

  // Cache identical maps — multiple containers with same dimensions/optics share one (v9 cache bust)
  const cacheKey = `${w}x${h}_${radius}_${curvature}_${bend}_${bendWidth}_${specularAngle}_${specularIntensity}_v9`;
  const cached = mapCache.get(cacheKey);
  if (cached) return cached;

  // Render displacement map at element resolution (bounded for performance)
  const maxDim = 512;
  const scale = Math.min(1, maxDim / Math.max(w, h));
  const canvasW = Math.max(32, Math.round(w * scale));
  const canvasH = Math.max(32, Math.round(h * scale));

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return '';

  const imgData = ctx.createImageData(canvasW, canvasH);
  const data = imgData.data;

  const halfW = canvasW / 2;
  const halfH = canvasH / 2;
  const r = Math.min(radius * scale, Math.min(halfW, halfH));
  const minDim = Math.min(canvasW, canvasH);
  // Natural meniscus rim width: smooth transition zone along the capillary boundary
  const rimWidth = Math.max(16, Math.min(48, bendWidth * minDim * 1.5));

  // Light angle and 3D lighting setup for natural liquid droplet crescent glint
  const lightRad = (specularAngle * Math.PI) / 180;
  const lx = Math.cos(lightRad);
  const ly = -Math.sin(lightRad);
  const lz = 0.75;
  const lLen = Math.hypot(lx, ly, lz) || 1;
  const nlx = lx / lLen;
  const nly = ly / lLen;
  const nlz = lz / lLen;

  // Blinn-Phong half-vector with camera view direction (0, 0, 1)
  const hx = nlx;
  const hy = nly;
  const hz = nlz + 1.0;
  const hLen = Math.hypot(hx, hy, hz) || 1;
  const nhx = hx / hLen;
  const nhy = hy / hLen;
  const nhz = hz / hLen;

  for (let py = 0; py < canvasH; py++) {
    const y = py - halfH;
    for (let px = 0; px < canvasW; px++) {
      const x = px - halfW;
      const idx = (py * canvasW + px) * 4;

      const d = roundedRectSDF(x, y, halfW, halfH, r);

      // Outside droplet: neutral 128 (no displacement), 0 alpha
      if (d > 0.5) {
        data[idx] = 128;
        data[idx + 1] = 128;
        data[idx + 2] = 128;
        data[idx + 3] = 0;
        continue;
      }

      // Compute 2D boundary gradient (unit normal pointing outwards to perimeter)
      const eps = 0.8;
      const dX =
        roundedRectSDF(x + eps, y, halfW, halfH, r) -
        roundedRectSDF(x - eps, y, halfW, halfH, r);
      const dY =
        roundedRectSDF(x, y + eps, halfW, halfH, r) -
        roundedRectSDF(x, y - eps, halfW, halfH, r);
      const normLen = length(dX, dY) || 1;
      const nx = dX / normLen;
      const ny = dY / normLen;

      // Distance inside droplet (0 at contact line perimeter, positive inside)
      const distInside = -d;

      // Normalized meniscus coordinate u: 0 at contact line, 1 at interior
      const u = Math.max(0, Math.min(1, distInside / rimWidth));

      // 1. Natural Sessile Water Droplet Meniscus Refraction:
      // At contact line (u = 0), fluid thickness is zero -> displacement is strictly 0.000.
      // Along the meniscus curve (u ~ 0.25-0.45), surface curves inward -> optical swell.
      // Toward interior (u -> 1.0), levels off into subtle dome baseline.
      const meniscusHump =
        Math.sin(Math.PI * Math.pow(u, 0.65)) * Math.pow(1 - u, 0.45);
      const dome = 0.08 * curvature * (1 - Math.pow(1 - u, 2));
      const totalStrength = 0.32 * bend * meniscusHump + dome;

      // Normalized coordinates from center (-1 to +1)
      const normX = x / halfW;
      const normY = y / halfH;

      const dispX = -normX * totalStrength;
      const dispY = -normY * totalStrength;

      const rVal = Math.max(0, Math.min(255, Math.round(128 + dispX * 125)));
      const gVal = Math.max(0, Math.min(255, Math.round(128 + dispY * 125)));

      // 2. Physical 3D Meniscus Ridge Highlight (centered on curved liquid shoulder, safely inside element)
      const shoulderGleam = Math.exp(-Math.pow((u - 0.2) / 0.16, 2));

      // Meniscus tilt: steepest at contact line, horizontal in center
      const tilt = Math.pow(1 - u, 1.2) * 0.72;
      const Nx = -nx * tilt;
      const Ny = -ny * tilt;
      const Nz = Math.sqrt(Math.max(0.01, 1 - Nx * Nx - Ny * Ny));

      // Key light directional crescent specular highlight (overhead reflection on the curved shoulder)
      const NdotH = Math.max(0, Nx * nhx + Ny * nhy + Nz * nhz);
      const specGlint =
        Math.pow(NdotH, 10) * specularIntensity * 1.5 * shoulderGleam;

      // Continuous 360-degree meniscus ridge sheen
      const ridgeSheen = shoulderGleam * 0.75 * specularIntensity;

      const totalShine = specGlint + ridgeSheen;
      const bVal = Math.max(
        0,
        Math.min(255, Math.round(128 + totalShine * 125)),
      );

      // 3. Shape alpha (smooth anti-aliased perimeter)
      const alpha =
        d <= 0
          ? 255
          : Math.max(0, Math.min(255, Math.round((1 - d * 2) * 255)));

      data[idx] = rVal;
      data[idx + 1] = gVal;
      data[idx + 2] = bVal;
      data[idx + 3] = alpha;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const result = canvas.toDataURL('image/png');

  // Store in cache, evict oldest if full
  if (mapCache.size >= MAP_CACHE_MAX) {
    const firstKey = mapCache.keys().next().value;
    if (firstKey !== undefined) mapCache.delete(firstKey);
  }
  mapCache.set(cacheKey, result);

  return result;
}
