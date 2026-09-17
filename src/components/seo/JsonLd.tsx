import React from 'react';

interface JsonLdProps {
  siteUrl?: string;
}

export function JsonLd({
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ashutoshram.vercel.app',
}: JsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: 'Ashutosh',
        givenName: 'Ashutosh',
        familyName: 'Kumar',
        additionalName: 'Intel 8085',
        alternateName: [
          'Ashutosh',
          'Ashutosh Kumar',
          'Intel 8085',
          'Intel8085',
          'ashutosh_0406',
          'Ashutosh-Repos',
          'ashutosh0406',
        ],
        jobTitle: 'Software Engineer & Systems Architect',
        disambiguatingDescription:
          'Ashutosh is a software engineer, open-source systems builder, and writer specializing in distributed architectures and low-latency infrastructure.',
        description:
          'Software engineer focused on the reliability, scalability, and performance optimization of backend systems, distributed architectures, and open source tools.',
        url: siteUrl,
        image: `${siteUrl}/images/image5.jpeg`,
        email: 'mailto:clashutosh04@gmail.com',
        sameAs: [
          'https://github.com/Ashutosh-Repos',
          'https://x.com/ashutosh_0406',
          'https://www.linkedin.com/in/ashutosh-kumar-2867182a2/',
          'https://leetcode.com/u/ashutosh0406/',
          'https://www.chess.com/member/ashu0442',
        ],
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: 'Dr. K. N. Modi Institute of Engineering and Technology',
        },
        knowsAbout: [
          'Software Engineering',
          'Distributed Systems',
          'Backend Engineering',
          'Systems Architecture',
          'Low-Latency Systems',
          'Intel 8085',
          'Microprocessors',
          'TypeScript',
          'Next.js',
          'React',
          'Go',
          'Database Internals',
          'Open Source Software',
        ],
        mainEntityOfPage: siteUrl,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Ashutosh',
        alternateName: [
          'Ashutosh Portfolio',
          'Ashutosh Website',
          'Ashutosh Personal Website',
          'Ashutosh (Intel 8085)',
          'Ashutosh Kumar',
        ],
        description:
          'Official portfolio and website of Ashutosh (aka Intel 8085) — software engineer, open-source creator of Bunly & Tessera, and technical writer on systems and architecture.',
        publisher: {
          '@id': `${siteUrl}/#person`,
        },
        author: {
          '@id': `${siteUrl}/#person`,
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/#profilepage`,
        url: siteUrl,
        name: 'Ashutosh Profile',
        isPartOf: {
          '@id': `${siteUrl}/#website`,
        },
        about: {
          '@id': `${siteUrl}/#person`,
        },
        mainEntity: {
          '@id': `${siteUrl}/#person`,
        },
      },
      {
        '@type': 'ItemList',
        name: 'Ashutosh Navigation',
        itemListElement: [
          {
            '@type': 'SiteNavigationElement',
            position: 1,
            name: 'About Ashutosh',
            description: 'Education, career experience, skills, and background of Ashutosh.',
            url: `${siteUrl}/about`,
          },
          {
            '@type': 'SiteNavigationElement',
            position: 2,
            name: 'Works & Projects',
            description: 'Open source tools, distributed systems, and projects built by Ashutosh.',
            url: `${siteUrl}/myworks`,
          },
          {
            '@type': 'SiteNavigationElement',
            position: 3,
            name: 'Essays & Writings',
            description: 'Reflections on software craftsmanship, engineering agency, and systems thinking by Ashutosh.',
            url: `${siteUrl}/writings`,
          },
          {
            '@type': 'SiteNavigationElement',
            position: 4,
            name: 'Technical Blogs',
            description: 'Deep dives on database internals, consensus algorithms, and system design by Ashutosh.',
            url: `${siteUrl}/blogs`,
          },
          {
            '@type': 'SiteNavigationElement',
            position: 5,
            name: 'Research Papershelf',
            description: 'Reading notes and architectural breakdowns of influential computer science papers by Ashutosh.',
            url: `${siteUrl}/papershelf`,
          },
          {
            '@type': 'SiteNavigationElement',
            position: 6,
            name: 'Contact Ashutosh',
            description: 'Direct contact channels and social profiles for Ashutosh.',
            url: `${siteUrl}/contactme`,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default JsonLd;
