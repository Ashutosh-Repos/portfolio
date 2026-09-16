import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Ashutosh',
  description:
    'Get in touch with Ashutosh for software engineering opportunities, technical advisory, systems architecture consulting, and open-source collaborations.',
  alternates: {
    canonical: '/contactme',
  },
  openGraph: {
    title: 'Contact — Ashutosh',
    description:
      'Get in touch with Ashutosh for software engineering opportunities, technical advisory, systems architecture consulting, and open-source collaborations.',
    url: '/contactme',
    siteName: 'Ashutosh',
  },
};


export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
