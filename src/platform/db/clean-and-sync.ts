import { db } from './index';
import { sql } from 'drizzle-orm';
import { seedAllWritings } from './seed-all-writings';
import { seedAllPapers } from './seed-all-papers';
import { seedMediaAndGalleries } from './seed-media-and-galleries';
import { seedHobbies } from './seed-hobbies';

export async function cleanAndSyncAll() {
  console.log('🧹 Cleaning old dummy publications from database...');

  // 1. Delete legacy dummy blogs (writing-1 through writing-8)
  await db.run(sql`
    DELETE FROM writing 
    WHERE id IN ('writing-1', 'writing-2', 'writing-3', 'writing-4', 'writing-5', 'writing-6', 'writing-7', 'writing-8')
       OR slug IN (
         'slop-debt',
         'what-ai-first-engineering-orgs-look-like',
         'three-claude-skills-i-think-every-org-should-have',
         'g-eval-explained',
         'ai-workflows-need-topological-sort',
         'embedding-models-make-or-break-your-ai-app',
         'temporal-primer-building-long-running-systems',
         'what-matters-in-production-rag'
       )
  `);

  // 2. Delete legacy placeholder stubs (paper-1 through paper-7, essay-1 through essay-7)
  await db.run(sql`
    DELETE FROM writing 
    WHERE id IN ('paper-1', 'paper-2', 'paper-3', 'paper-4', 'paper-5', 'paper-6', 'paper-7',
                 'essay-1', 'essay-2', 'essay-3', 'essay-4', 'essay-5', 'essay-6', 'essay-7')
  `);

  console.log('✨ Cleaned legacy dummy blogs, placeholder essays, and placeholder paper rows.');

  // 3. Seed authentic personal essays
  await seedAllWritings();

  // 4. Seed all 83 research papers
  await seedAllPapers();

  // 5. Seed media, galleries, education, experience, and profile
  await seedMediaAndGalleries();

  // 6. Seed movies and webseries
  await seedHobbies();

  // 7. Seed schema completeness: achievements, skills, integration providers, tags & writingTags
  const { seedSchemaCompleteness } = await import('./seed-schema-completeness');
  await seedSchemaCompleteness();

  console.log('🚀 Completed full clean and synchronization successfully!');
}

if (require.main === module) {
  cleanAndSyncAll()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error during clean and sync:', err);
      process.exit(1);
    });
}
