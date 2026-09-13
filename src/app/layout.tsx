import type { Metadata } from 'next';
import { Schibsted_Grotesk, JetBrains_Mono, Alex_Brush } from 'next/font/google';
import './globals.css';
import { Provider } from '@/components/provider';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-3-0-blond.vercel.app',
  ),
  title: {
    default: 'Ashutosh Kumar — Software Engineer & Open-Source Builder',
    template: '%s — Ashutosh Kumar',
  },
  description:
    'Portfolio of Ashutosh Kumar — software engineer, open-source contributor, and builder of systems, tools, and libraries.',
  keywords: [
    'Ashutosh Kumar',
    'software engineer',
    'portfolio',
    'open source',
    'full stack developer',
    'React',
    'Next.js',
    'TypeScript',
  ],
  authors: [{ name: 'Ashutosh Kumar' }],
  creator: 'Ashutosh Kumar',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Ashutosh Kumar',
    title: 'Ashutosh Kumar — Software Engineer & Open-Source Builder',
    description:
      'Portfolio of Ashutosh Kumar — software engineer, open-source contributor, and builder of systems, tools, and libraries.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashutosh Kumar — Software Engineer & Open-Source Builder',
    description:
      'Portfolio of Ashutosh Kumar — software engineer, open-source contributor, and builder of systems, tools, and libraries.',
  },
};

export const schibstedGrotesk = Schibsted_Grotesk({
  variable: '--font-schibsted-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const alexBrush = Alex_Brush({
  variable: '--font-alex-brush',
  subsets: ['latin'],
  weight: ['400'],
});

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${schibstedGrotesk.className} ${jetbrainsMono.variable} ${alexBrush.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
