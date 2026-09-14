import { db, schema } from './index';

export async function seedSchemaCompleteness() {
  console.log(
    '💎 Seeding complete schema assets: achievements, skills, integration providers, tags & relations...',
  );
  const now = Date.now();

  // 1. Achievements & Certifications from Resume
  const achievements = [
    {
      id: 'ach-nptel-ml-iit-madras',
      slug: 'nptel-introduction-to-machine-learning-iit-madras',
      title: 'NPTEL Introduction to Machine Learning (IIT Madras)',
      issuer: 'IIT Madras & NPTEL',
      category: 'certification',
      dateAwarded: '2024',
      credentialUrl:
        'https://drive.google.com/file/d/1f2qJJqo2xs55loxId9gMPqsY4tMEJ4sZ/view',
      description:
        'Elite Certification awarded for scoring 73% in Introduction to Machine Learning course administered by Indian Institute of Technology Madras (IIT Madras).',
      mediaId: null,
      sortOrder: 1,
    },
    {
      id: 'ach-aws-storage',
      slug: 'aws-educate-getting-started-with-storage',
      title: 'AWS Educate – Getting Started with Storage',
      issuer: 'Amazon Web Services (AWS)',
      category: 'certification',
      dateAwarded: '2024',
      credentialUrl:
        'https://www.credly.com/badges/f59a5959-4fa2-4e7d-bbef-ac02dc054479/public_url',
      description:
        'Comprehensive certification covering AWS cloud storage services, high-throughput Amazon S3 object storage architectures, EBS block storage, and Glacier cold archives.',
      mediaId: null,
      sortOrder: 2,
    },
    {
      id: 'ach-nptel-cp-iit-gandhinagar',
      slug: 'nptel-getting-started-with-competitive-programming-iit-gandhinagar',
      title:
        'NPTEL Getting Started with Competitive Programming (IIT Gandhinagar)',
      issuer: 'IIT Gandhinagar & NPTEL',
      category: 'certification',
      dateAwarded: '2024',
      credentialUrl:
        'https://drive.google.com/file/d/13yCM5VDp5MaNgYTaddG5fzpNHo9tBCCo/view?usp=sharing',
      description:
        'Scored 62% in Getting Started with Competitive Programming course administered by Indian Institute of Technology Gandhinagar (IIT Gandhinagar) and NPTEL.',
      mediaId: null,
      sortOrder: 3,
    },
  ];

  for (const a of achievements) {
    await db
      .insert(schema.achievement)
      .values(a)
      .onConflictDoUpdate({
        target: schema.achievement.id,
        set: {
          title: a.title,
          issuer: a.issuer,
          category: a.category,
          dateAwarded: a.dateAwarded,
          credentialUrl: a.credentialUrl,
          description: a.description,
          sortOrder: a.sortOrder,
        },
      });
  }
  console.log(`✅ Seeded ${achievements.length} achievements`);

  // 2. Integration Providers (GitHub, LeetCode, TMDB)
  const providers = [
    {
      providerKey: 'github',
      displayName: 'GitHub',
      accountIdentifier: 'Ashutosh-Repos',
      syncFrequencyHours: 6,
      lastSyncedAt: now,
      syncStatus: 'success',
      lastError: null,
      metadataJson: JSON.stringify({
        profileUrl: 'https://github.com/Ashutosh-Repos',
        repoCount: 53,
      }),
    },
    {
      providerKey: 'leetcode',
      displayName: 'LeetCode',
      accountIdentifier: 'ashutosh0406',
      syncFrequencyHours: 6,
      lastSyncedAt: now,
      syncStatus: 'success',
      lastError: null,
      metadataJson: JSON.stringify({
        profileUrl: 'https://leetcode.com/u/ashutosh0406/',
        solvedCount: 164,
      }),
    },
    {
      providerKey: 'tmdb',
      displayName: 'The Movie Database (TMDB)',
      accountIdentifier: 'ashutosh04',
      syncFrequencyHours: 24,
      lastSyncedAt: now,
      syncStatus: 'idle',
      lastError: null,
      metadataJson: JSON.stringify({
        description:
          'Curated watch history: Marvel, DC, Indian blockbusters, and binge-worthy webseries',
      }),
    },
  ];

  for (const p of providers) {
    await db
      .insert(schema.integrationProvider)
      .values(p)
      .onConflictDoUpdate({
        target: schema.integrationProvider.providerKey,
        set: {
          displayName: p.displayName,
          accountIdentifier: p.accountIdentifier,
          syncFrequencyHours: p.syncFrequencyHours,
          lastSyncedAt: p.lastSyncedAt,
          syncStatus: p.syncStatus,
          metadataJson: p.metadataJson,
        },
      });
  }
  console.log(`✅ Seeded ${providers.length} integration providers`);

  // 3. Full Resume Skills Matrix
  const allResumeSkills = [
    // Languages
    {
      name: 'TypeScript',
      slug: 'typescript',
      category: 'languages',
      tier: 'master',
      years: 4,
      icon: 'typescript',
      featured: true,
      order: 1,
    },
    {
      name: 'JavaScript',
      slug: 'javascript',
      category: 'languages',
      tier: 'master',
      years: 5,
      icon: 'javascript',
      featured: true,
      order: 2,
    },
    {
      name: 'Go (Golang)',
      slug: 'go',
      category: 'languages',
      tier: 'proficient',
      years: 2,
      icon: 'go',
      featured: true,
      order: 3,
    },
    {
      name: 'Java',
      slug: 'java',
      category: 'languages',
      tier: 'proficient',
      years: 3,
      icon: 'java',
      featured: false,
      order: 4,
    },
    {
      name: 'Python',
      slug: 'python',
      category: 'languages',
      tier: 'proficient',
      years: 3,
      icon: 'python',
      featured: true,
      order: 5,
    },
    {
      name: 'SQL',
      slug: 'sql',
      category: 'languages',
      tier: 'master',
      years: 4,
      icon: 'sql',
      featured: true,
      order: 6,
    },

    // Backend & Networking
    {
      name: 'Express.js',
      slug: 'express',
      category: 'frameworks',
      tier: 'master',
      years: 4,
      icon: 'express',
      featured: true,
      order: 7,
    },
    {
      name: 'net/http',
      slug: 'net-http',
      category: 'frameworks',
      tier: 'proficient',
      years: 2,
      icon: 'go',
      featured: false,
      order: 8,
    },
    {
      name: 'gRPC',
      slug: 'grpc',
      category: 'networking',
      tier: 'proficient',
      years: 2,
      icon: 'grpc',
      featured: true,
      order: 9,
    },
    {
      name: 'HTTP 1.1/2/3',
      slug: 'http-protocols',
      category: 'networking',
      tier: 'master',
      years: 4,
      icon: 'http',
      featured: false,
      order: 10,
    },
    {
      name: 'TCP/UDP Sockets',
      slug: 'tcp-udp',
      category: 'networking',
      tier: 'proficient',
      years: 3,
      icon: 'network',
      featured: false,
      order: 11,
    },
    {
      name: 'Server-Sent Events (SSE)',
      slug: 'sse',
      category: 'networking',
      tier: 'master',
      years: 3,
      icon: 'stream',
      featured: true,
      order: 12,
    },
    {
      name: 'WebSockets',
      slug: 'websockets',
      category: 'networking',
      tier: 'master',
      years: 3,
      icon: 'websocket',
      featured: true,
      order: 13,
    },

    // Frontend
    {
      name: 'React.js',
      slug: 'react',
      category: 'frameworks',
      tier: 'master',
      years: 4,
      icon: 'react',
      featured: true,
      order: 14,
    },
    {
      name: 'Next.js',
      slug: 'nextjs',
      category: 'frameworks',
      tier: 'master',
      years: 3,
      icon: 'nextjs',
      featured: true,
      order: 15,
    },
    {
      name: 'Tailwind CSS',
      slug: 'tailwindcss',
      category: 'frameworks',
      tier: 'master',
      years: 4,
      icon: 'tailwind',
      featured: true,
      order: 16,
    },
    {
      name: 'HTML5 & CSS3',
      slug: 'html5-css3',
      category: 'frameworks',
      tier: 'master',
      years: 5,
      icon: 'html5',
      featured: false,
      order: 17,
    },

    // Databases & Cloud Infra
    {
      name: 'PostgreSQL',
      slug: 'postgresql',
      category: 'databases',
      tier: 'master',
      years: 3,
      icon: 'postgresql',
      featured: true,
      order: 18,
    },
    {
      name: 'MongoDB',
      slug: 'mongodb',
      category: 'databases',
      tier: 'proficient',
      years: 3,
      icon: 'mongodb',
      featured: true,
      order: 19,
    },
    {
      name: 'SQLite / libSQL',
      slug: 'sqlite',
      category: 'databases',
      tier: 'master',
      years: 3,
      icon: 'sqlite',
      featured: true,
      order: 20,
    },
    {
      name: 'Prisma ORM',
      slug: 'prisma',
      category: 'databases',
      tier: 'master',
      years: 3,
      icon: 'prisma',
      featured: false,
      order: 21,
    },
    {
      name: 'Mongoose',
      slug: 'mongoose',
      category: 'databases',
      tier: 'proficient',
      years: 3,
      icon: 'mongodb',
      featured: false,
      order: 22,
    },
    {
      name: 'Redis',
      slug: 'redis',
      category: 'databases',
      tier: 'master',
      years: 3,
      icon: 'redis',
      featured: true,
      order: 23,
    },
    {
      name: 'NATS JetStream',
      slug: 'nats-jetstream',
      category: 'cloud_infra',
      tier: 'proficient',
      years: 2,
      icon: 'nats',
      featured: true,
      order: 24,
    },
    {
      name: 'S3 Object Storage',
      slug: 's3-storage',
      category: 'cloud_infra',
      tier: 'master',
      years: 3,
      icon: 'aws',
      featured: true,
      order: 25,
    },
    {
      name: 'Docker',
      slug: 'docker',
      category: 'cloud_infra',
      tier: 'proficient',
      years: 3,
      icon: 'docker',
      featured: true,
      order: 26,
    },

    // Tools & AI
    {
      name: 'Git & GitHub',
      slug: 'git',
      category: 'tools',
      tier: 'master',
      years: 5,
      icon: 'git',
      featured: true,
      order: 27,
    },
    {
      name: 'LLM Integration (OpenAI, Gemini, Claude)',
      slug: 'llm-integration',
      category: 'ai_ml',
      tier: 'master',
      years: 2,
      icon: 'ai',
      featured: true,
      order: 28,
    },
  ];

  for (const s of allResumeSkills) {
    await db
      .insert(schema.skill)
      .values({
        id: `skill-${s.slug}`,
        slug: s.slug,
        name: s.name,
        category: s.category,
        proficiencyTier: s.tier,
        yearsOfExperience: s.years,
        iconSlug: s.icon,
        isFeatured: s.featured,
        sortOrder: s.order,
      })
      .onConflictDoUpdate({
        target: schema.skill.id,
        set: {
          name: s.name,
          category: s.category,
          proficiencyTier: s.tier,
          yearsOfExperience: s.years,
          iconSlug: s.icon,
          isFeatured: s.featured,
          sortOrder: s.order,
        },
      });
  }
  console.log(
    `✅ Seeded ${allResumeSkills.length} comprehensive skills from resume`,
  );

  // 4. Tags & WritingTag Relationships
  const tagsList = [
    {
      id: 'tag-dist-sys',
      slug: 'distributed-systems',
      name: 'Distributed Systems',
      description:
        'Consensus, replication, fault-tolerance, and cluster orchestration',
    },
    {
      id: 'tag-databases',
      slug: 'databases',
      name: 'Databases & Storage',
      description:
        'RDBMS, distributed SQL, columnar stores, NoSQL, and memory engines',
    },
    {
      id: 'tag-concurrency',
      slug: 'concurrency',
      name: 'Concurrency & Locks',
      description:
        'Multithreading, lock-free structures, memory models, and race conditions',
    },
    {
      id: 'tag-algorithms',
      slug: 'algorithms',
      name: 'Algorithms & Data Structures',
      description:
        'Probabilistic filters, indexing trees, sorting, and graph processing',
    },
    {
      id: 'tag-networking',
      slug: 'networking',
      name: 'Networking & Protocols',
      description:
        'P2P protocols, BitTorrent, gRPC, HTTP/2, and low-latency transport',
    },
    {
      id: 'tag-ai-ml',
      slug: 'ai-ml',
      name: 'AI & Machine Learning',
      description:
        'Transformers, generative pre-training, subword units, and LLM inference',
    },
    {
      id: 'tag-design-phil',
      slug: 'design-philosophy',
      name: 'Design & Craft',
      description:
        'Product intuition, aesthetics as a moat, and thoughtful software construction',
    },
    {
      id: 'tag-system-arch',
      slug: 'system-architecture',
      name: 'System Architecture',
      description:
        'Production scale architectures, caching strategies, and event streaming',
    },
  ];

  for (const t of tagsList) {
    await db
      .insert(schema.tag)
      .values(t)
      .onConflictDoUpdate({
        target: schema.tag.id,
        set: {
          name: t.name,
          slug: t.slug,
          description: t.description,
        },
      });
  }
  console.log(`✅ Seeded ${tagsList.length} canonical tags`);

  // Map writings to tags
  const allWritings = await db.select().from(schema.writing);
  await db.delete(schema.writingTag);

  let mappedCount = 0;
  for (const w of allWritings) {
    const assignedTagIds: string[] = [];
    const textToScan = `${w.title} ${w.subtitle || ''} ${w.excerpt || ''} ${
      w.tagsJson || ''
    }`.toLowerCase();

    if (w.type === 'essay') {
      assignedTagIds.push('tag-design-phil');
    }

    if (
      textToScan.includes('database') ||
      textToScan.includes('spanner') ||
      textToScan.includes('dynamo') ||
      textToScan.includes('redshift') ||
      textToScan.includes('sql') ||
      textToScan.includes('storage') ||
      textToScan.includes('bigtable') ||
      textToScan.includes('mongo') ||
      textToScan.includes('aurora')
    ) {
      assignedTagIds.push('tag-databases');
    }

    if (
      textToScan.includes('distributed') ||
      textToScan.includes('consensus') ||
      textToScan.includes('mapreduce') ||
      textToScan.includes('pregel') ||
      textToScan.includes('chubby') ||
      textToScan.includes('zanzibar') ||
      textToScan.includes('gfs') ||
      textToScan.includes('cluster') ||
      textToScan.includes('shuffle')
    ) {
      assignedTagIds.push('tag-dist-sys');
    }

    if (
      textToScan.includes('thread') ||
      textToScan.includes('lock') ||
      textToScan.includes('concurren') ||
      textToScan.includes('deadlock') ||
      textToScan.includes('blocking')
    ) {
      assignedTagIds.push('tag-concurrency');
    }

    if (
      textToScan.includes('bloom') ||
      textToScan.includes('hash') ||
      textToScan.includes('tree') ||
      textToScan.includes('sort') ||
      textToScan.includes('radix') ||
      textToScan.includes('filter') ||
      textToScan.includes('count')
    ) {
      assignedTagIds.push('tag-algorithms');
    }

    if (
      textToScan.includes('network') ||
      textToScan.includes('bittorrent') ||
      textToScan.includes('tcp') ||
      textToScan.includes('udp') ||
      textToScan.includes('grpc') ||
      textToScan.includes('dns') ||
      textToScan.includes('anycast') ||
      textToScan.includes('peer-to-peer') ||
      textToScan.includes('kademlia')
    ) {
      assignedTagIds.push('tag-networking');
    }

    if (
      textToScan.includes('learning') ||
      textToScan.includes('attention') ||
      textToScan.includes('language model') ||
      textToScan.includes('neural') ||
      textToScan.includes('llm') ||
      textToScan.includes('inference')
    ) {
      assignedTagIds.push('tag-ai-ml');
    }

    if (assignedTagIds.length === 0) {
      assignedTagIds.push('tag-system-arch');
    }

    for (const tagId of [...new Set(assignedTagIds)]) {
      await db
        .insert(schema.writingTag)
        .values({
          writingId: w.id,
          tagId,
        })
        .onConflictDoNothing();
      mappedCount++;
    }
  }
  console.log(`✅ Seeded ${mappedCount} writing-tag relational associations`);

  // 5. Media Relations (link education to covers)
  const allMedia = await db.select().from(schema.mediaItem);
  if (allMedia.length > 0) {
    await db.delete(schema.mediaRelation);

    // Link graduation education to cover
    const gradMedia = allMedia.find((m) =>
      m.storageKey.startsWith('graduation_time/'),
    );
    if (gradMedia) {
      await db
        .insert(schema.mediaRelation)
        .values({
          id: 'mr-edu-grad-cover',
          entityType: 'education',
          entityId: 'edu-btech-mmmut',
          mediaId: gradMedia.id,
          role: 'cover',
          sortOrder: 1,
        })
        .onConflictDoNothing();
    }

    // Link diploma education to cover
    const diplomaMedia = allMedia.find((m) =>
      m.storageKey.startsWith('diploma_time/'),
    );
    if (diplomaMedia) {
      await db
        .insert(schema.mediaRelation)
        .values({
          id: 'mr-edu-diploma-cover',
          entityType: 'education',
          entityId: 'edu-diploma-firozabad',
          mediaId: diplomaMedia.id,
          role: 'cover',
          sortOrder: 1,
        })
        .onConflictDoNothing();
    }

    // Link inter education to cover
    const interMedia = allMedia.find((m) => m.storageKey.startsWith('inter/'));
    if (interMedia) {
      await db
        .insert(schema.mediaRelation)
        .values({
          id: 'mr-edu-inter-cover',
          entityType: 'education',
          entityId: 'edu-intermediate-john-milton',
          mediaId: interMedia.id,
          role: 'cover',
          sortOrder: 1,
        })
        .onConflictDoNothing();
    }

    // Link high school education to cover
    const hsMedia = allMedia.find((m) =>
      m.storageKey.startsWith('high_school/'),
    );
    if (hsMedia) {
      await db
        .insert(schema.mediaRelation)
        .values({
          id: 'mr-edu-hs-cover',
          entityType: 'education',
          entityId: 'edu-matriculation-smpkd',
          mediaId: hsMedia.id,
          role: 'cover',
          sortOrder: 1,
        })
        .onConflictDoNothing();
    }
    console.log('✅ Seeded mediaRelation links for education covers');
  }

  console.log('💎 Schema completeness synchronization complete!');
}

if (require.main === module) {
  seedSchemaCompleteness()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Failed to seed schema completeness:', err);
      process.exit(1);
    });
}
