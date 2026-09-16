import type { Metadata } from 'next';
import {
  Schibsted_Grotesk,
  JetBrains_Mono,
  Alex_Brush,
} from 'next/font/google';
import './globals.css';
import { JsonLd } from '@/components/seo/JsonLd';
import { ThemeProvider } from '@/components/theme-provider';
import { SparklesBackground } from '@/components/ui/sparkles';
import { Navbar } from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import GradualBlur from '@/components/ui/gradual-blur';
import { SmoothCursor } from '@/components/ui/smooth-cursor';
import {
  ScrollProgressProvider,
  ScrollProgress,
  ScrollProgressContainer,
} from '@/components/animate-ui/primitives/animate/scroll-progress';


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ashutosh — Software Engineer & Systems Architect',
    template: '%s | Ashutosh',
  },
  description:
    'Official portfolio and personal website of Ashutosh (aka Intel 8085) — software engineer, open-source builder, and systems architect specializing in distributed architectures, low-latency systems, and backend reliability engineering.',
  keywords: [
    'Ashutosh',
    'Ashutosh software engineer',
    'Ashutosh developer',
    'Ashutosh backend engineer',
    'Ashutosh systems architect',
    'Ashutosh portfolio',
    'Ashutosh official website',
    'Ashutosh personal website',
    'Ashutosh Kumar',
    'Ashutosh Kumar software engineer',
    'Ashutosh Intel 8085',
    'Intel 8085 Ashutosh',
    'Intel 8085',
    'ashutosh_0406',
    'Ashutosh-Repos',
    'ashutosh0406',
    'Ashutosh projects',
    'Ashutosh writings',
    'Ashutosh blogs',
    'Ashutosh research papers',
    'distributed systems engineer',
    'systems architecture',
    'low latency backend',
    'database internals',
    'Bunly',
    'Tessera',
    'open source engineer',
    'Next.js',
    'TypeScript',
    'React',
  ],
  authors: [
    {
      name: 'Ashutosh',
      url: siteUrl,
    },
    {
      name: 'Ashutosh Kumar',
      url: 'https://github.com/Ashutosh-Repos',
    },
  ],
  creator: 'Ashutosh',
  publisher: 'Ashutosh',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Ashutosh',
    title: 'Ashutosh — Software Engineer & Systems Architect',
    description:
      'Official portfolio and personal website of Ashutosh (aka Intel 8085) — software engineer, open-source creator of Bunly & Tessera, and builder of distributed systems.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ashutosh_0406',
    creator: '@ashutosh_0406',
    title: 'Ashutosh — Software Engineer & Systems Architect',
    description:
      'Official portfolio and personal website of Ashutosh (aka Intel 8085) — software engineer, open-source creator of Bunly & Tessera, and builder of distributed systems.',
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
      <body className="h-screen w-screen overflow-hidden relative">
        <JsonLd siteUrl={siteUrl} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="absolute w-screen h-screen z-[-1] pointer-events-none my-auto mx-auto">
            <SparklesBackground />
          </div>

          <ScrollProgressProvider>
            <ScrollProgress className="fixed top-0 left-0 z-60 pointer-events-none h-2 rounded-br-full rounded-tr-full bg-zinc-700/50 dark:bg-zinc-100/50 backdrop-blur-xs"/>
            <ScrollProgressContainer className="h-screen w-full mx-auto overflow-x-clip overflow-y-scroll no-scrollbar">
              <Navbar />
              <main className="w-full px-4 max-w-5xl mx-auto pt-16 sm:pt-20 pb-16">
                {children}
              </main>
              <Footer />
            </ScrollProgressContainer>
          </ScrollProgressProvider>

          <GradualBlur
            target="parent"
            position="bottom"
            height="7rem"
            strength={2}
            divCount={5}
            curve="bezier"
            exponential
            opacity={1}
          />
          <SmoothCursor />
        </ThemeProvider>
      </body>
    </html>
  );
}
