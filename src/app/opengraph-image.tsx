import { ImageResponse } from 'next/og';

export const alt = 'Ashutosh (Intel 8085) — Software Engineer & Builder';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '70px 80px',
          backgroundColor: '#030712',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.15), transparent 50%)',
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#f8fafc',
        }}
      >
        {/* Top Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              color: '#93c5fd',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Software Engineer
          </div>
          <div
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              fontSize: '15px',
              fontWeight: 500,
              letterSpacing: '0.06em',
            }}
          >
            Open Source Builder
          </div>
        </div>

        {/* Center Hero Name & Moniker */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: '68px',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#ffffff',
              }}
            >
              Ashutosh
            </span>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 400,
                color: '#64748b',
              }}
            >
              aka
            </span>
            <span
              style={{
                fontSize: '56px',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#38bdf8',
                letterSpacing: '-0.02em',
              }}
            >
              Intel 8085
            </span>
          </div>

          <p
            style={{
              fontSize: '24px',
              lineHeight: 1.4,
              color: '#94a3b8',
              margin: '8px 0 0 0',
              maxWidth: '900px',
            }}
          >
            Crafting reliable, low-latency backend architectures, distributed
            systems, and creator of open-source tools like Bunly and Tessera.
          </p>
        </div>

        {/* Bottom Metadata Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '18px',
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span style={{ color: '#cbd5e1' }}>github.com/Ashutosh-Repos</span>
            <span>•</span>
            <span style={{ color: '#cbd5e1' }}>@ashutosh_0406</span>
          </div>
          <div
            style={{
              color: '#38bdf8',
              fontWeight: 500,
            }}
          >
            {process.env.NEXT_PUBLIC_SITE_URL
              ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host
              : 'Intel 8085'}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
