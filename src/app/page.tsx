import { About } from '@/components/about/About';
import { Container } from '@/components/liquid/Container';
import { Experience } from '@/components/experience/experience';
import { DeveloperStats } from '@/components/DeveloperStats';
import { Projects } from '@/components/projects/Projects';
import { Writings } from '@/components/Writings/writing';
import { PaperShelf } from '@/components/Writings/papershelf';
import { Blogs } from '@/components/Writings/blogs';
import { GLASS_OPTICS } from '@/lib/glass-config';
import { experienceService } from '@/platform/modules/experience/experience.service';
import { writingService } from '@/platform/modules/writing/writing.service';
import { blogService } from '@/platform/modules/blogs/blog.service';

export default async function Home() {
  const [experiences, blogsResult, essaysResult, papersResult] = await Promise.all([
    experienceService.getExperiences().catch(() => []),
    blogService.getBlogs({ limit: 10 }).catch(() => ({ items: [] })),
    writingService.getWritings({ type: 'essay', limit: 10 }).catch(() => ({ items: [] })),
    writingService.getWritings({ type: 'research_paper', limit: 10 }).catch(() => ({ items: [] })),
  ]);

  const mappedCompanies = experiences.map((exp) => ({
    name: exp.company,
    role: exp.role,
    logo: exp.logoUrl || '/images/inamigossq.jpg',
    url: exp.companyUrl || undefined,
    description: exp.description || undefined,
  }));

  const formatWritingDate = (ts: number | null) => {
    if (!ts) return 'Recent';
    const d = new Date(ts);
    return `${d.getDate()}/${d.toLocaleString('en-US', { month: 'short' })}/${d.getFullYear()}`;
  };

  const mappedBlogs = blogsResult.items.map((w) => ({
    title: w.title,
    date: formatWritingDate(w.publishedAt),
    slug: w.slug,
  }));

  const mappedEssays = essaysResult.items.map((w) => ({
    title: w.title,
    date: formatWritingDate(w.publishedAt),
    slug: w.slug,
  }));

  const mappedPapers = papersResult.items.map((w) => ({
    title: w.title,
    date: formatWritingDate(w.publishedAt),
    slug: w.slug,
  }));

  return (
    <div className="w-full flex flex-col min-[890px]:grid min-[890px]:grid-cols-3 gap-6 items-start">
      {/* Left Column (2 of 3 cols on desktop): About, Developer Stats, Projects & Blogs */}
      <div className="contents min-[890px]:flex min-[890px]:flex-col min-[890px]:col-span-2 min-[890px]:gap-6 min-[890px]:w-full">
        <div className="order-1 min-[890px]:order-0 w-full">
          <Container
            className="p-6 sm:p-7 rounded-[32px] bg-[#d5ede6]/20 dark:bg-[#1a3832]/20 transition-all duration-300 w-full"
            radius={36}
            optics={GLASS_OPTICS}
          >
            <About />
          </Container>
        </div>

        <div className="order-3 min-[890px]:order-0 w-full">
          <DeveloperStats />
        </div>

        <div className="order-4 min-[890px]:order-0 w-full">
          <Container
            className="p-5 sm:p-6 rounded-[32px] bg-[#d5ede6]/20 dark:bg-[#1a3832]/20 transition-all duration-300 w-full"
            radius={36}
            optics={GLASS_OPTICS}
          >
            <Projects />
          </Container>
        </div>

        <div className="order-5 min-[890px]:order-0 w-full">
          <Container
            className="p-5 sm:p-6 rounded-[32px] bg-[#d5ede6]/20 dark:bg-[#1a3832]/20 transition-all duration-300 w-full"
            radius={36}
            optics={GLASS_OPTICS}
          >
            <Blogs items={mappedBlogs.length > 0 ? mappedBlogs : undefined} />
          </Container>
        </div>
      </div>

      {/* Right Column (1 of 3 cols on desktop): Experience & Writings */}
      <div className="contents min-[890px]:flex min-[890px]:flex-col min-[890px]:col-span-1 min-[890px]:gap-6 min-[890px]:w-full">
        <div className="order-2 min-[890px]:order-0 w-full">
          <Container
            className="p-5 sm:p-6 rounded-[32px] bg-[#d5ede6]/20 dark:bg-[#1a3832]/20 transition-all duration-300 w-full"
            radius={36}
            optics={GLASS_OPTICS}
          >
            <Experience companies={mappedCompanies.length > 0 ? mappedCompanies : undefined} />
          </Container>
        </div>

        <div className="order-4 min-[890px]:order-0 w-full">
          <Container
            className="p-5 sm:p-6 rounded-[32px] bg-[#d5ede6]/20 dark:bg-[#1a3832]/20 transition-all duration-300 w-full"
            radius={36}
            optics={GLASS_OPTICS}
          >
            <Writings items={mappedEssays.length > 0 ? mappedEssays : undefined} />
          </Container>
        </div>
        <div className="order-4 min-[890px]:order-0 w-full">
          <Container
            className="p-5 sm:p-6 rounded-[32px] bg-[#d5ede6]/20 dark:bg-[#1a3832]/20 transition-all duration-300 w-full"
            radius={36}
            optics={GLASS_OPTICS}
          >
            <PaperShelf items={mappedPapers.length > 0 ? mappedPapers : undefined} />
          </Container>
        </div>
      </div>
    </div>
  );
}
