import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 86400; // Cache for 24 hours

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const parsed = new URL(targetUrl);

    // SSRF protection: only allow https and block private/internal hosts
    if (parsed.protocol !== 'https:') {
      return new NextResponse('Only HTTPS URLs are allowed', { status: 400 });
    }
    const blockedHostPatterns = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2\d|3[01])\./,
      /^192\.168\./,
      /^0\./,
      /^\[::1\]$/,
      /^169\.254\./,
      /\.local$/i,
      /\.internal$/i,
    ];
    if (blockedHostPatterns.some((re) => re.test(parsed.hostname))) {
      return new NextResponse('Blocked URL', { status: 403 });
    }

    const host = parsed.hostname.toLowerCase();

    // Known high-fidelity rich preview images
    if (host.includes('chess.com') && parsed.pathname.includes('/member/')) {
      const username = parsed.pathname.split('/member/')[1]?.replace(/\/$/, '');
      if (username) {
        return NextResponse.redirect(
          `https://www.chess.com/share/user/${username}`,
          307,
        );
      }
    }

    if (host.includes('inamigosfoundation.org.in')) {
      return NextResponse.redirect(
        'https://inamigosfoundation.org.in/public/storage/slideshow/1738235951.jpg',
        307,
      );
    }

    if (
      host.includes('github.com') &&
      parsed.pathname.split('/').filter(Boolean).length === 1
    ) {
      const username = parsed.pathname.split('/')[1];
      return NextResponse.redirect(
        `https://opengraph.githubassets.com/1/${username}`,
        307,
      );
    }

    // Generic: fetch HTML to extract og:image / twitter:image
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    try {
      const res = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          Accept: 'text/html,application/xhtml+xml',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const html = await res.text();
        const ogMatch =
          html.match(
            /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
          ) ||
          html.match(
            /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
          ) ||
          html.match(
            /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
          ) ||
          html.match(
            /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
          );

        if (ogMatch && ogMatch[1]) {
          let ogImage = ogMatch[1].trim();
          if (ogImage.startsWith('//')) {
            ogImage = `https:${ogImage}`;
          } else if (ogImage.startsWith('/')) {
            ogImage = `${parsed.origin}${ogImage}`;
          }
          return NextResponse.redirect(ogImage, 307);
        }
      }
    } catch {
      clearTimeout(timeout);
    }

    // Fallback to desktop screenshot via Microlink
    const params = new URLSearchParams({
      url: targetUrl,
      screenshot: 'true',
      meta: 'false',
      embed: 'screenshot.url',
      'viewport.width': '1280',
      'viewport.height': '800',
    });
    return NextResponse.redirect(
      `https://api.microlink.io/?${params.toString()}`,
      307,
    );
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }
}
