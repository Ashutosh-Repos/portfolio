#!/usr/bin/env tsx
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { db, schema } from '../src/platform/db';
import { cleanAndSyncAll } from '../src/platform/db/clean-and-sync';
import { seedMediaAndGalleries } from '../src/platform/db/seed-media-and-galleries';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const rl = readline.createInterface({ input, output });

  console.log('\n========================================================');
  console.log('   🚀 Ashutosh Kumar — Portfolio Content Manager CLI    ');
  console.log('========================================================');
  console.log('1. 📸 Auto-scan & Sync Media (Travel, Graduation, etc.)');
  console.log('2. 📄 Add a Research Paper (Google Drive PDF, Year, Venue)');
  console.log('3. ✍️  Add a Personal Essay / Writing');
  console.log('4. 📝 Add a Technical Blog');
  console.log('5. 💼 Add Work Experience / Internship');
  console.log('6. 🎓 Add Education Record');
  console.log('7. ⚡ Add Technical Skill');
  console.log('8. 🎬 Add Movie or Web Series');
  console.log('9. 🔄 Run Full Clean & Sync (All publications & tables)');
  console.log('0. 🚪 Exit\n');

  const choice = (await rl.question('Enter option (0-9): ')).trim();
  const now = Date.now();

  try {
    switch (choice) {
      case '1': {
        console.log('\n📸 Scanning public asset folders (travel, graduation_time, diploma_time, etc.)...');
        await seedMediaAndGalleries();
        console.log('✅ Media assets and galleries synchronized successfully!\n');
        break;
      }

      case '2': {
        console.log('\n📄 Add a New Research Paper');
        const title = (await rl.question('Paper Title: ')).trim();
        if (!title) {
          console.log('❌ Title is required.');
          break;
        }
        const driveUrl = (await rl.question('Google Drive PDF URL: ')).trim();
        const yearStr = (await rl.question('Publication Year (e.g. 2024): ')).trim();
        const year = parseInt(yearStr, 10) || new Date().getFullYear();
        const venue = (await rl.question('Venue / Conference (e.g. OSDI, VLDB, arXiv): ')).trim() || 'Seminal Systems';
        const summary = (await rl.question('Architectural summary / takeaway: ')).trim() || title;

        const slug = slugify(title);
        const paperId = `paper-${slug}`;

        // Insert into schema.researchPaper
        await db
          .insert(schema.researchPaper)
          .values({
            id: paperId,
            slug,
            title,
            excerpt: summary,
            contentMarkdown: `# ${title}\n\n**Published in:** ${venue} (${year})\n\n[📄 Read Original Paper PDF](${driveUrl})\n\n## Architectural Summary\n\n${summary}`,
            paperUrl: driveUrl,
            venue,
            year,
            readingTimeMinutes: 20,
            takeawaysJson: JSON.stringify([summary]),
            tagsJson: JSON.stringify(['Research Paper', venue]),
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: schema.researchPaper.id,
            set: {
              title,
              excerpt: summary,
              paperUrl: driveUrl,
              venue,
              year,
              updatedAt: now,
            },
          });

        // Insert into schema.writing
        await db
          .insert(schema.writing)
          .values({
            id: paperId,
            slug,
            title,
            subtitle: `${venue} (${year})`,
            excerpt: summary,
            contentMarkdown: `# ${title}\n\n**Published in:** ${venue} (${year})\n\n[📄 Read Original Paper PDF](${driveUrl})\n\n## Architectural Summary\n\n${summary}`,
            type: 'research_paper',
            status: 'published',
            publishedAt: new Date(year, 0, 1).getTime(),
            updatedAt: now,
            readingTimeMinutes: 20,
            canonicalUrl: driveUrl,
            tagsJson: JSON.stringify(['Research Paper', venue]),
          })
          .onConflictDoUpdate({
            target: schema.writing.id,
            set: {
              title,
              subtitle: `${venue} (${year})`,
              excerpt: summary,
              canonicalUrl: driveUrl,
              updatedAt: now,
            },
          });

        console.log(`\n✅ Paper added successfully!`);
        console.log(`🔗 Live URL: http://localhost:3000/papershelf/${slug}`);
        break;
      }

      case '3': {
        console.log('\n✍️ Add a Personal Essay');
        const title = (await rl.question('Essay Title: ')).trim();
        if (!title) {
          console.log('❌ Title is required.');
          break;
        }
        const excerpt = (await rl.question('Subtitle / Excerpt: ')).trim() || title;
        const markdown = (await rl.question('Content Markdown (or short summary): ')).trim() || excerpt;
        const slug = slugify(title);
        const id = `essay-${slug}`;

        await db
          .insert(schema.writing)
          .values({
            id,
            slug,
            title,
            subtitle: excerpt,
            excerpt,
            contentMarkdown: markdown.startsWith('#') ? markdown : `# ${title}\n\n${markdown}`,
            type: 'essay',
            status: 'published',
            publishedAt: now,
            updatedAt: now,
            readingTimeMinutes: Math.max(2, Math.round(markdown.split(/\s+/).length / 200)),
            canonicalUrl: `https://portfolio-3-0-blond.vercel.app/writings/${slug}`,
            tagsJson: JSON.stringify(['Personal Essay', 'Design & Craft']),
          })
          .onConflictDoUpdate({
            target: schema.writing.id,
            set: { title, subtitle: excerpt, excerpt, updatedAt: now },
          });

        console.log(`\n✅ Essay added successfully!`);
        console.log(`🔗 Live URL: http://localhost:3000/writings/${slug}`);
        break;
      }

      case '4': {
        console.log('\n📝 Add a Technical Blog');
        const title = (await rl.question('Blog Title: ')).trim();
        if (!title) {
          console.log('❌ Title is required.');
          break;
        }
        const excerpt = (await rl.question('Summary / Excerpt: ')).trim() || title;
        const markdown = (await rl.question('Blog Markdown (or paste content): ')).trim() || excerpt;
        const slug = slugify(title);
        const id = `blog-${slug}`;

        // Insert into schema.blog
        await db
          .insert(schema.blog)
          .values({
            id,
            slug,
            title,
            excerpt,
            canonicalUrl: `https://portfolio-3-0-blond.vercel.app/blogs/${slug}`,
            readingTimeMinutes: Math.max(3, Math.round(markdown.split(/\s+/).length / 200)),
            tagsJson: JSON.stringify(['Technical Blog', 'Engineering']),
            contentMarkdown: markdown.startsWith('#') ? markdown : `# ${title}\n\n${markdown}`,
            publishedAt: now,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: schema.blog.id,
            set: { title, excerpt, updatedAt: now },
          });

        // Insert into schema.writing
        await db
          .insert(schema.writing)
          .values({
            id,
            slug,
            title,
            subtitle: excerpt,
            excerpt,
            contentMarkdown: markdown.startsWith('#') ? markdown : `# ${title}\n\n${markdown}`,
            type: 'blog_post',
            status: 'published',
            publishedAt: now,
            updatedAt: now,
            readingTimeMinutes: Math.max(3, Math.round(markdown.split(/\s+/).length / 200)),
            canonicalUrl: `https://portfolio-3-0-blond.vercel.app/blogs/${slug}`,
            tagsJson: JSON.stringify(['Technical Blog', 'Engineering']),
          })
          .onConflictDoUpdate({
            target: schema.writing.id,
            set: { title, subtitle: excerpt, excerpt, updatedAt: now },
          });

        console.log(`\n✅ Technical Blog added successfully!`);
        console.log(`🔗 Live URL: http://localhost:3000/blogs/${slug}`);
        break;
      }

      case '5': {
        console.log('\n💼 Add / Update Work Experience');
        const company = (await rl.question('Company Name: ')).trim();
        const role = (await rl.question('Role (e.g. Backend Intern): ')).trim();
        const startDate = (await rl.question('Start Date (e.g. 2026-05): ')).trim();
        const endDate = (await rl.question('End Date (leave blank if Present): ')).trim() || null;
        const description = (await rl.question('Summary description: ')).trim();

        const slug = slugify(company);
        const id = `exp-${slug}`;

        await db
          .insert(schema.experience)
          .values({
            id,
            slug,
            company,
            role,
            employmentType: 'internship',
            location: 'Remote',
            locationType: 'remote',
            startDate,
            endDate,
            isCurrent: !endDate,
            description,
            responsibilitiesJson: JSON.stringify([description]),
            achievementsJson: JSON.stringify([]),
            technologiesJson: JSON.stringify(['TypeScript', 'Node.js']),
            storyMarkdown: description,
            sortOrder: 1,
            createdAt: now,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: schema.experience.id,
            set: { role, startDate, endDate, isCurrent: !endDate, description, updatedAt: now },
          });

        console.log(`\n✅ Experience saved! Visible at http://localhost:3000/about`);
        break;
      }

      case '6': {
        console.log('\n🎓 Add / Update Education');
        const institution = (await rl.question('Institution Name: ')).trim();
        const degree = (await rl.question('Degree (e.g. B.Tech, Diploma): ')).trim();
        const fieldOfStudy = (await rl.question('Field of Study (e.g. Computer Science): ')).trim();
        const gradeOrCgpa = (await rl.question('CGPA / Percentage: ')).trim();
        const startDate = (await rl.question('Start Year: ')).trim();
        const endDate = (await rl.question('End Year (or Present): ')).trim();

        const slug = slugify(institution);
        const id = `edu-${slug}`;

        await db
          .insert(schema.education)
          .values({
            id,
            slug,
            institution,
            degree,
            fieldOfStudy,
            gradeOrCgpa,
            location: 'India',
            startDate,
            endDate,
            isCurrent: endDate.toLowerCase().includes('present'),
            description: `${degree} in ${fieldOfStudy} from ${institution}.`,
            highlightsJson: JSON.stringify([`${degree} in ${fieldOfStudy} (${startDate} - ${endDate})`]),
            linksJson: JSON.stringify([]),
            sortOrder: 1,
            createdAt: now,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: schema.education.id,
            set: { institution, degree, fieldOfStudy, gradeOrCgpa, startDate, endDate, updatedAt: now },
          });

        console.log(`\n✅ Education saved! Visible at http://localhost:3000/about`);
        break;
      }

      case '7': {
        console.log('\n⚡ Add Technical Skill');
        const name = (await rl.question('Skill Name (e.g. Rust, Kafka, Kubernetes): ')).trim();
        console.log('Categories: languages, networking, frameworks, databases, cloud_infra, ai_ml, tools');
        const category = (await rl.question('Category: ')).trim() || 'tools';
        console.log('Tiers: master, proficient, familiar');
        const tier = (await rl.question('Proficiency Tier: ')).trim() || 'proficient';

        const slug = slugify(name);
        const id = `skill-${slug}`;

        await db
          .insert(schema.skill)
          .values({
            id,
            slug,
            name,
            category,
            proficiencyTier: tier,
            yearsOfExperience: 2,
            iconSlug: slug,
            isFeatured: true,
            sortOrder: 1,
          })
          .onConflictDoUpdate({
            target: schema.skill.id,
            set: { name, category, proficiencyTier: tier },
          });

        console.log(`\n✅ Skill added! Visible at http://localhost:3000/about`);
        break;
      }

      case '8': {
        console.log('\n🎬 Add Movie or Web Series');
        const title = (await rl.question('Title: ')).trim();
        console.log('Type: movie or tv_series');
        const type = (await rl.question('Type (movie / tv_series): ')).trim().toLowerCase() === 'tv_series' ? 'tv_series' : 'movie';
        const year = parseInt((await rl.question('Release Year: ')).trim(), 10) || new Date().getFullYear();
        const rating = parseFloat((await rl.question('Rating (1-10): ')).trim()) || 9.0;
        const review = (await rl.question('Your personal review / note: ')).trim() || title;

        const slug = slugify(title);
        const id = `${type}-${slug}`;

        await db
          .insert(schema.mediaEntry)
          .values({
            id,
            slug,
            type,
            title,
            releaseYear: year,
            genresJson: JSON.stringify(['Favorite']),
            creatorsJson: JSON.stringify([]),
            myRating: rating,
            watchStatus: 'completed',
            tier: 'favorite',
            personalReview: review,
            favoriteCharactersJson: JSON.stringify([]),
            favoriteScenesJson: JSON.stringify([]),
            quotesJson: JSON.stringify([]),
            createdAt: now,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: schema.mediaEntry.id,
            set: { title, releaseYear: year, myRating: rating, personalReview: review, updatedAt: now },
          });

        const targetUrl = type === 'movie' ? 'http://localhost:3000/about/hobbies/movies' : 'http://localhost:3000/about/hobbies/webseries';
        console.log(`\n✅ ${type === 'movie' ? 'Movie' : 'Web Series'} added!`);
        console.log(`🔗 Visible at: ${targetUrl}`);
        break;
      }

      case '9': {
        console.log('\n🔄 Running full synchronization & purge of legacy placeholders...');
        await cleanAndSyncAll();
        console.log('✅ Full synchronization complete! Zero inconsistencies.');
        break;
      }

      case '0':
      default: {
        console.log('Goodbye! 👋');
        break;
      }
    }
  } catch (err) {
    console.error('❌ Error executing action:', err);
  } finally {
    rl.close();
    process.exit(0);
  }
}

main();
