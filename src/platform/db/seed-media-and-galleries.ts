import { db, schema } from './index';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

export async function seedMediaAndGalleries() {
  console.log('🖼️ Scanning and seeding media items and galleries...');
  const now = Date.now();
  const publicDir = path.join(process.cwd(), 'public');

  // Helper to scan directory
  const scanFolder = (relDir: string) => {
    const fullPath = path.join(publicDir, relDir);
    if (!fs.existsSync(fullPath)) return [];
    return fs.readdirSync(fullPath).filter((f) => !f.startsWith('.')).map((f) => ({
      filename: f,
      relPath: `/${relDir}/${encodeURIComponent(f)}`,
      rawRelPath: `/${relDir}/${f}`,
      fullPath: path.join(fullPath, f),
      size: fs.statSync(path.join(fullPath, f)).size,
    }));
  };

  const highSchoolFiles = scanFolder('high_school');
  const interFiles = scanFolder('inter');
  const diplomaFiles = scanFolder('diploma_time');
  const graduationFiles = scanFolder('graduation_time');
  const travelFiles = scanFolder('travel');

  console.log(
    `Found images: High School (${highSchoolFiles.length}), Inter (${interFiles.length}), Diploma (${diplomaFiles.length}), Graduation (${graduationFiles.length}), Travel (${travelFiles.length})`
  );

  // 1. Insert Media Items
  const insertMediaList = async (files: ReturnType<typeof scanFolder>, prefix: string) => {
    const mediaIds: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = path.extname(file.filename).toLowerCase();
      const mime = ext === '.png' ? 'image/png' : ext === '.avif' ? 'image/avif' : 'image/jpeg';
      const id = `media-${prefix}-${i + 1}`;
      const storageKey = `${prefix}/${file.filename}`;
      const lowerName = file.filename.toLowerCase();

      let caption = `${prefix.replace(/_/g, ' ')} photograph`;
      if (prefix === 'travel') {
        if (lowerName.includes('zoo')) caption = 'Shaheed Ashfaq Ullah Khan Zoological Park, Gorakhpur';
        else if (lowerName.includes('nauka')) caption = 'Nauka Vihar & Ramgarh Tal Lakefront, Gorakhpur';
        else if (lowerName.includes('taj')) caption = 'Taj Mahal & Yamuna Riverfront, Agra';
        else if (lowerName.includes('nepal') || lowerName.includes('lumbini')) caption = 'Lumbini Sacred Sanctuary, Nepal';
        else if (lowerName.includes('kushinagar')) caption = 'Mahaparinirvana Temple, Kushinagar';
      }

      await db
        .insert(schema.mediaItem)
        .values({
          id,
          filename: file.filename,
          mimeType: mime,
          byteSize: file.size,
          width: null,
          height: null,
          blurhash: null,
          altText: caption,
          caption,
          storageKey,
          publicUrl: file.rawRelPath,
          exifJson: null,
          createdAt: now,
        })
        .onConflictDoUpdate({
          target: schema.mediaItem.id,
          set: {
            publicUrl: file.rawRelPath,
            byteSize: file.size,
            caption,
            altText: caption,
          },
        });

      mediaIds.push(id);
    }
    return mediaIds;
  };

  const hsMediaIds = await insertMediaList(highSchoolFiles, 'high_school');
  const interMediaIds = await insertMediaList(interFiles, 'inter');
  const diplomaMediaIds = await insertMediaList(diplomaFiles, 'diploma');
  const gradMediaIds = await insertMediaList(graduationFiles, 'graduation');
  const travelMediaIds = await insertMediaList(travelFiles, 'travel');

  // Filter travel media by destination
  const gkpTravelMediaIds = travelFiles
    .map((f, i) => ({ f, id: travelMediaIds[i] }))
    .filter(({ f }) => f.filename.toLowerCase().includes('zoo') || f.filename.toLowerCase().includes('nauka'))
    .map(({ id }) => id);

  const agraTravelMediaIds = travelFiles
    .map((f, i) => ({ f, id: travelMediaIds[i] }))
    .filter(({ f }) => f.filename.toLowerCase().includes('taj'))
    .map(({ id }) => id);

  const nepalTravelMediaIds = travelFiles
    .map((f, i) => ({ f, id: travelMediaIds[i] }))
    .filter(({ f }) => f.filename.toLowerCase().includes('nepal') || f.filename.toLowerCase().includes('lumbini'))
    .map(({ id }) => id);

  const kushinagarTravelMediaIds = travelFiles
    .map((f, i) => ({ f, id: travelMediaIds[i] }))
    .filter(({ f }) => f.filename.toLowerCase().includes('kushinagar'))
    .map(({ id }) => id);

  // 2. Create Galleries
  const galleries = [
    {
      id: 'gallery-high-school',
      slug: 'high-school-smpkd',
      title: 'High School - S.M.P.K.D Shikshan Sansthan',
      description: 'Foundational years completing Matriculation (Class X) in Science with 75.16%.',
      coverMediaId: hsMediaIds[0] || null,
      mediaIds: hsMediaIds,
    },
    {
      id: 'gallery-inter',
      slug: 'intermediate-john-milton',
      title: 'Intermediate - John Milton Public School',
      description: 'Senior secondary education completing Class XII in Physics, Chemistry, and Mathematics (PCM) with 77.8%.',
      coverMediaId: interMediaIds[0] || null,
      mediaIds: interMediaIds,
    },
    {
      id: 'gallery-diploma',
      slug: 'diploma-govt-polytechnic',
      title: 'Diploma in Mechanical Engineering - Govt. Polytechnic Firozabad',
      description: 'Three-year technical diploma curriculum (2020-2023) covering engineering mechanics, thermodynamics, and design fundamentals.',
      coverMediaId: diplomaMediaIds[0] || null,
      mediaIds: diplomaMediaIds,
    },
    {
      id: 'gallery-graduation',
      slug: 'graduation-mmmut-gorakhpur',
      title: 'B.Tech in Computer Science - MMMUT Gorakhpur',
      description: 'Undergraduate engineering journey at Madan Mohan Malaviya University of Technology (2023-2026), systems engineering, campus life, and deep work.',
      coverMediaId: gradMediaIds[0] || null,
      mediaIds: gradMediaIds,
    },
    {
      id: 'gallery-travel-gorakhpur',
      slug: 'travel-gorakhpur-zoo-nauka-vihar',
      title: 'Gorakhpur Explorations: Zoo & Ramgarh Tal',
      description: 'Lakeside boating and sunsets at Nauka Vihar (Ramgarh Tal), and wild habitat trails at Shaheed Ashfaq Ullah Khan Zoological Park.',
      coverMediaId: gkpTravelMediaIds[0] || null,
      mediaIds: gkpTravelMediaIds,
    },
    {
      id: 'gallery-travel-agra',
      slug: 'travel-agra-taj-mahal',
      title: 'Agra: The Taj Mahal & Yamuna Riverfront',
      description: 'Mughal architectural wonder, symmetrical ivory marble domes, and riverside reflections in Agra, Uttar Pradesh.',
      coverMediaId: agraTravelMediaIds[0] || null,
      mediaIds: agraTravelMediaIds,
    },
    {
      id: 'gallery-travel-nepal-lumbini',
      slug: 'travel-nepal-lumbini',
      title: 'Nepal & Lumbini: Sacred Sanctuary of the Buddha',
      description: 'Trans-Himalayan crossing into Nepal. Exploring the sacred birthplace of Gautama Buddha at Lumbini, Maya Devi Temple, and ancient monastic ruins.',
      coverMediaId: nepalTravelMediaIds[0] || null,
      mediaIds: nepalTravelMediaIds,
    },
    {
      id: 'gallery-travel-kushinagar',
      slug: 'travel-kushinagar',
      title: 'Kushinagar: The Mahaparinirvana Sacred Path',
      description: 'Historical and spiritual expedition to Kushinagar, the sacred site of Gautama Buddha’s Mahaparinirvana, ancient stupas, and peaceful terracotta grounds.',
      coverMediaId: kushinagarTravelMediaIds[0] || null,
      mediaIds: kushinagarTravelMediaIds,
    },
  ];

  for (const g of galleries) {
    await db
      .insert(schema.gallery)
      .values({
        id: g.id,
        slug: g.slug,
        title: g.title,
        description: g.description,
        coverMediaId: g.coverMediaId,
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: schema.gallery.id,
        set: {
          title: g.title,
          description: g.description,
          coverMediaId: g.coverMediaId,
        },
      });

    // Populate gallery items
    for (let sortIdx = 0; sortIdx < g.mediaIds.length; sortIdx++) {
      const mediaId = g.mediaIds[sortIdx];
      const giId = `gi-${g.id}-${sortIdx + 1}`;
      await db
        .insert(schema.galleryItem)
        .values({
          id: giId,
          galleryId: g.id,
          mediaId,
          sortOrder: sortIdx + 1,
          captionOverride: null,
        })
        .onConflictDoNothing();
    }
  }

  // 3. Populate Education mapped to Galleries
  console.log('🎓 Seeding authentic Education entries mapped to galleries...');
  const educationEntries = [
    {
      id: 'edu-btech-mmmut',
      slug: 'mmmut-gorakhpur-btech-cse',
      institution: 'Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur',
      degree: 'B.Tech',
      fieldOfStudy: 'Computer Science and Engineering',
      gradeOrCgpa: '7.32 CGPA',
      location: 'Gorakhpur, Uttar Pradesh, India',
      startDate: '2023',
      endDate: '2026',
      isCurrent: true,
      description: 'Undergraduate engineering studies in Computer Science. Core coursework in Operating Systems, Database Management Systems, Computer Networks, Compilers, and Distributed Computing.',
      highlightsJson: JSON.stringify([
        'B.Tech in Computer Science and Engineering (2023 - 2026)',
        'Active open-source contributor and builder of distributed systems pipelines (Tessera, ShAI, and Cheating Daddy)',
        'Maintained strong technical depth in low-level concurrency, microservices, and database internals'
      ]),
      linksJson: JSON.stringify([
        { title: 'University Website', url: 'http://www.mmmut.ac.in/', type: 'institution' },
        { title: 'GitHub Profile', url: 'https://github.com/Ashutosh-Repos', type: 'project' }
      ]),
      logoMediaId: gradMediaIds[0] || null,
      galleryId: 'gallery-graduation',
      sortOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'edu-diploma-firozabad',
      slug: 'govt-polytechnic-firozabad-diploma',
      institution: 'Government Polytechnic Firozabad',
      degree: 'Diploma',
      fieldOfStudy: 'Mechanical Engineering',
      gradeOrCgpa: 'First Division',
      location: 'Firozabad, Uttar Pradesh, India',
      startDate: '2020',
      endDate: '2023',
      isCurrent: false,
      description: 'Completed 3-year technical diploma program in Mechanical Engineering. Built foundational strengths in applied mechanics, thermodynamics, engineering drawings, and industrial manufacturing.',
      highlightsJson: JSON.stringify([
        'Diploma in Mechanical Engineering (2020 - 2023)',
        'Practical workshop training, CAD modeling, and industrial fabrication'
      ]),
      linksJson: JSON.stringify([]),
      logoMediaId: diplomaMediaIds[0] || null,
      galleryId: 'gallery-diploma',
      sortOrder: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'edu-intermediate-john-milton',
      slug: 'john-milton-intermediate',
      institution: 'John Milton Public School (CBSE)',
      degree: 'Intermediate (XIIth)',
      fieldOfStudy: 'PCM (Physics, Chemistry, Mathematics)',
      gradeOrCgpa: '77.8%',
      location: 'Agra, Uttar Pradesh, India',
      startDate: '2018',
      endDate: '2020',
      isCurrent: false,
      description: 'Senior secondary certificate examination under Central Board of Secondary Education (CBSE) with rigorous specialization in Physics, Chemistry, and Advanced Mathematics.',
      highlightsJson: JSON.stringify([
        'Scored 77.8% in CBSE Class XII Board Examination',
        'Strong academic foundation in analytical mathematics, mechanics, and computational logic'
      ]),
      linksJson: JSON.stringify([]),
      logoMediaId: interMediaIds[0] || null,
      galleryId: 'gallery-inter',
      sortOrder: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'edu-matriculation-smpkd',
      slug: 'smpkd-matriculation-high-school',
      institution: 'S.M.P.K.D Shikshan Sansthan (CBSE)',
      degree: 'Matriculation (Xth)',
      fieldOfStudy: 'Science',
      gradeOrCgpa: '75.16%',
      location: 'Uttar Pradesh, India',
      startDate: '2017',
      endDate: '2018',
      isCurrent: false,
      description: 'Secondary school certificate examination under Central Board of Secondary Education (CBSE) with core focus on General Science, Mathematics, and Computer Applications.',
      highlightsJson: JSON.stringify([
        'Scored 75.16% in CBSE Class X Board Examination in 2018'
      ]),
      linksJson: JSON.stringify([]),
      logoMediaId: hsMediaIds[0] || null,
      galleryId: 'gallery-high-school',
      sortOrder: 4,
      createdAt: now,
      updatedAt: now,
    },
  ];

  // Delete legacy dummy edu-btech if it exists
  await db.delete(schema.education).where(sql`${schema.education.id} = 'edu-btech'`);

  for (const edu of educationEntries) {
    await db
      .insert(schema.education)
      .values(edu)
      .onConflictDoUpdate({
        target: schema.education.id,
        set: {
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          gradeOrCgpa: edu.gradeOrCgpa,
          location: edu.location,
          startDate: edu.startDate,
          endDate: edu.endDate,
          isCurrent: edu.isCurrent,
          description: edu.description,
          highlightsJson: edu.highlightsJson,
          linksJson: edu.linksJson,
          logoMediaId: edu.logoMediaId,
          galleryId: edu.galleryId,
          sortOrder: edu.sortOrder,
          updatedAt: now,
        },
      });
  }

  // 4. Update Experience (InAmigos & Cheating Daddy)
  console.log('💼 Seeding authentic Experience records...');
  const experiences = [
    {
      id: 'exp-inamigos',
      slug: 'inamigos-foundation',
      company: 'InAmigos Foundation',
      role: 'Web Development Intern',
      employmentType: 'contract',
      location: 'Remote',
      locationType: 'remote',
      startDate: '2026-05',
      endDate: '2026-06',
      isCurrent: false,
      description: 'Web development internship delivering user-facing volunteer portals and scalable backend service routes.',
      responsibilitiesJson: JSON.stringify([
        'Responsive UI Development: Built responsive UI views for event registration and volunteer signup portals across mobile and desktop viewport sizes.',
        'Backend & Latency Optimization: Refactored Express.js REST API routes and database query layers, reducing backend latency by 30% for high-traffic social project signup endpoints.'
      ]),
      achievementsJson: JSON.stringify([
        'Reduced registration endpoint p95 latency by 30% through index optimizations and payload pruning.',
        'Delivered complete cross-browser tested UI for volunteer intake.'
      ]),
      technologiesJson: JSON.stringify(['JavaScript', 'Express.js', 'React.js', 'REST APIs', 'Node.js']),
      storyMarkdown: 'Focused on high-impact optimizations for volunteer management and low-latency API access during the internship.',
      companyUrl: 'https://inamigosfoundation.org.in/',
      logoUrl: '/images/inamigossq.jpg',
      galleryId: null,
      sortOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'exp-cheating-daddy',
      slug: 'cheating-daddy-open-source',
      company: 'Cheating Daddy',
      role: 'Open Source Contributor',
      employmentType: 'open_source',
      location: 'Remote',
      locationType: 'remote',
      startDate: '2024-03',
      endDate: '2024-05',
      isCurrent: false,
      description: 'Open source project contributions resolving core application performance and workflow usability issues.',
      responsibilitiesJson: JSON.stringify([
        'Submitted and merged core Pull Request #370 (Approved review: sohzm/cheating-daddy#370).',
        'Debugged asynchronous event handling and state race hazards across multi-window client sessions.',
        'Improved reliability and system resource footprint during background execution.'
      ]),
      achievementsJson: JSON.stringify([
        'Approved and merged Pull Request #370 by project maintainers.',
        'Resolved critical stability bugs affecting community contributors.'
      ]),
      technologiesJson: JSON.stringify(['TypeScript', 'Node.js', 'Git', 'Open Source', 'GitHub Actions']),
      storyMarkdown: 'Collaborated with maintainers to review architecture, test edge cases, and push production-ready open source patches.',
      companyUrl: 'https://github.com/sohzm/cheating-daddy',
      logoUrl: null,
      galleryId: null,
      sortOrder: 2,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const exp of experiences) {
    await db
      .insert(schema.experience)
      .values(exp)
      .onConflictDoUpdate({
        target: schema.experience.id,
        set: {
          company: exp.company,
          role: exp.role,
          employmentType: exp.employmentType,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate,
          isCurrent: exp.isCurrent,
          description: exp.description,
          responsibilitiesJson: exp.responsibilitiesJson,
          achievementsJson: exp.achievementsJson,
          technologiesJson: exp.technologiesJson,
          companyUrl: exp.companyUrl,
          logoUrl: exp.logoUrl,
          sortOrder: exp.sortOrder,
          updatedAt: now,
        },
      });
  }

  // 5. Update Profile with full resume details
  console.log('👤 Seeding Profile from Resume...');
  await db
    .insert(schema.profile)
    .values({
      id: 'ashutosh-profile',
      name: 'Ashutosh',
      headline: 'Software Engineer & Systems Builder',
      bio: 'Engineering high-throughput distributed engines, AI developer utilities, and modern web architectures. B.Tech in Computer Science from MMMUT Gorakhpur.',
      currentFocus: 'Distributed systems, Go microservices, database storage internals, and AI agents.',
      location: 'India',
      availabilityStatus: 'Open to Software Engineering & Systems roles',
      socialLinksJson: JSON.stringify([
        { platform: 'GitHub', url: 'https://github.com/Ashutosh-Repos', username: 'Ashutosh-Repos', icon: 'github' },
        { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/ashutosh-kumar-2867182a2', username: 'ashutosh-kumar', icon: 'linkedin' },
        { platform: 'LeetCode', url: 'https://leetcode.com/u/ashutosh0406', username: 'ashutosh0406', icon: 'code' },
        { platform: 'Portfolio', url: 'https://portfolio-3-0-blond.vercel.app', username: 'portfolio', icon: 'globe' },
        { platform: 'Email', url: 'mailto:clashutosh04@gmail.com', username: 'clashutosh04@gmail.com', icon: 'mail' },
      ]),
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: schema.profile.id,
      set: {
        name: 'Ashutosh',
        headline: 'Software Engineer & Systems Builder',
        bio: 'Engineering high-throughput distributed engines, AI developer utilities, and modern web architectures. B.Tech in Computer Science from MMMUT Gorakhpur.',
        currentFocus: 'Distributed systems, Go microservices, database storage internals, and AI agents.',
        availabilityStatus: 'Open to Software Engineering & Systems roles',
        socialLinksJson: JSON.stringify([
          { platform: 'GitHub', url: 'https://github.com/Ashutosh-Repos', username: 'Ashutosh-Repos', icon: 'github' },
          { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/ashutosh-kumar-2867182a2', username: 'ashutosh-kumar', icon: 'linkedin' },
          { platform: 'LeetCode', url: 'https://leetcode.com/u/ashutosh0406', username: 'ashutosh0406', icon: 'code' },
          { platform: 'Portfolio', url: 'https://portfolio-3-0-blond.vercel.app', username: 'portfolio', icon: 'globe' },
          { platform: 'Email', url: 'mailto:clashutosh04@gmail.com', username: 'clashutosh04@gmail.com', icon: 'mail' },
        ]),
        updatedAt: now,
      },
    });

  console.log('✨ Completed seeding media, galleries, education, experience, and profile!');
}

if (require.main === module) {
  seedMediaAndGalleries()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Failed seeding media and galleries:', err);
      process.exit(1);
    });
}
