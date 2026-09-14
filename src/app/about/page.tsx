import type { Metadata } from 'next';
import Link from 'next/link';
import { educationService } from '@/platform/modules/education/education.service';
import { experienceService } from '@/platform/modules/experience/experience.service';
import { skillsService } from '@/platform/modules/skills/skills.service';
import { Container } from '@/components/liquid/Container';
import { EducationCard } from '@/components/Education/EducationCard';
import { Award, Film, Tv, ExternalLink, Compass } from 'lucide-react';
import Image from 'next/image';
import LinkPreview from '@/components/ui/link-preview';
import LiquidGlassAvatar from '@/components/about/LiquidGlassAvatar';
import { SkillsShowcase } from '@/components/skills';

export const metadata: Metadata = {
  title: 'About — Ashutosh Kumar',
  description:
    'Background, education, experience, achievements, and engineering journey of Ashutosh Kumar.',
};

export default async function AboutPage() {
  const [educationList, experiences, skills, achievements] = await Promise.all([
    educationService.getEducationList().catch(() => []),
    experienceService.getExperiences().catch(() => []),
    skillsService.getSkills().catch(() => []),
    skillsService.getAchievements().catch(() => []),
  ]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 pt-4">
      <Link
        href="/"
        className="text-sm font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
      >
        &larr; Back to Home
      </Link>

      {/* ------------------------ */}
      <div className="p-2 pb-4 flow-root">
        {/* Avatar floated right with circular shape-outside text wrapping */}
        <div
          className="float-right ml-4 mb-3 sm:ml-6 sm:mb-4 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full"
          style={{
            shapeOutside: 'circle(50%)',
            shapeMargin: '1.25rem',
          }}
        >
          <LiquidGlassAvatar
            firstImageSrc="/images/image5.jpeg"
            secondImageSrc="/images/image2.jpg"
            alt="Ashutosh"
            className="w-full h-full"
          />
        </div>

        {/* Name at top left */}
        <h1 className="text-xl md:text-2xl text-foreground mb-3 sm:mb-4">
          <span className="font-bold">Ashutosh</span>{' '}
          <span className="text-foreground/50 text-sm">aka</span>{' '}
          <span className="italic text-base font-light">Intel 8085</span>
        </h1>

        {/* Para 1: Bio & Social links — wraps organically around the circular avatar */}
        <div className="text-base text-foreground leading-normal mb-3 sm:mb-4">
          I&apos;m a software engineer at heart, tinkering with the reliability,
          scalability, and performance optimization of backend systems almost
          90% of the time. I&apos;m mostly active on{' '}
          <LinkPreview
            url="https://x.com/ashutosh_0406"
            title="X / Twitter"
            dotGap={8}
            dotOffset={-1}
          >
            X/Twitter
          </LinkPreview>
          {', '}
          <LinkPreview
            url="https://www.linkedin.com/in/ashutosh-kumar-2867182a2/"
            title="LinkedIn"
            dotGap={8}
            dotOffset={-1}
          >
            LinkedIn
          </LinkPreview>
          {' and '}
          <LinkPreview
            url="https://github.com/Ashutosh-Repos"
            title="GitHub"
            dotGap={8}
            dotOffset={-1}
          >
            GitHub
          </LinkPreview>{' '}
          where I share everything.
        </div>

        {/* Para 2: Hobbies / Interests */}
        <div className="text-base text-foreground leading-normal mb-4">
          When I&apos;m not coding, I usually watch{' '}
          <LinkPreview
            url="/about/hobbies/movies"
            title="Movies"
            dotGap={8}
            dotOffset={-1}
          >
            movies
          </LinkPreview>{' '}
          and{' '}
          <LinkPreview
            url="/about/hobbies/webseries"
            title="Web Series"
            dotGap={8}
            dotOffset={-1}
          >
            web-series
          </LinkPreview>
          {', '}
          <LinkPreview
            url="https://www.chess.com/member/ashu0442"
            title="Chess.com"
            dotGap={8}
            dotOffset={-1}
          >
            play chess
          </LinkPreview>{' '}
          or plan my next solo{' '}
          <LinkPreview
            url="/about/hobbies/travel"
            title="Travel"
            dotGap={8}
            dotOffset={-1}
          >
            trip
          </LinkPreview>
          .
        </div>

        <div className="text-base text-foreground pb-2">
          I&apos;ve been building an open-source video engine,{' '}
          <LinkPreview
            url="https://github.com/Ashutosh-Repos/Tessera"
            title="Tessera"
            dotGap={8}
            dotOffset={-1}
          >
            Tessera
          </LinkPreview>
          . It&apos;s a self-hosted alternative to AWS Elemental and Mux that
          reduces enterprise transcoding bills. I regularly update this engine
          with tighter memory and latency optimizations, keeping infrastructure
          costs as low as possible.
        </div>

        <div className="text-base text-foreground leading-loose pt-1">
          I&apos;m a continuous learner, currently focusing on Distributed
          systems, microservices, database storage internals, and AI agents and
          looking of opportunities to work in these domains.
        </div>

        <h1 className="text-xl md:text-2xl text-foreground mb-3 sm:mb-4 mt-8">
          <span className="font-bold">My</span>{' '}
          <span className="text-foreground/50 text-sm">technical</span>{' '}
          <span className="italic text-base font-light">skills</span>
        </h1>

        <SkillsShowcase skills={skills} />
      </div>
      {/* ------------------------ */}

      {/* Education Section with Photo Galleries */}
      <section className="flex flex-col gap-4">
        <h1 className="text-xl md:text-2xl text-foreground">
          <span className="font-bold">My</span>{' '}
          <span className="text-foreground/50 text-sm">Educational</span>{' '}
          <span className="italic text-base font-light">Journey</span>
        </h1>

        <div className="grid grid-cols-1 gap-5">
          {educationList.map((edu) => (
            <EducationCard key={edu.id} education={edu} />
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="flex flex-col gap-4">
        <h1 className="text-xl md:text-2xl text-foreground">
          <span className="font-bold">My</span>{' '}
          <span className="text-foreground/50 text-sm">Industry</span>{' '}
          <span className="italic text-base font-light">Experience</span>
        </h1>

        <div className="grid grid-cols-1 gap-4">
          {experiences.map((exp) => (
            <Container
              key={exp.id}
              className="p-5 sm:p-6 rounded-2xl"
              contentClassName="flex flex-col gap-3.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {exp.logoUrl && (
                    <Image
                      src={exp.logoUrl}
                      alt={exp.company}
                      width={44}
                      height={44}
                      className="rounded-xl object-cover border border-black/10 dark:border-white/10"
                    />
                  )}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-foreground/60 font-mono">
                      {exp.company} &bull; {exp.location || 'Remote'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-foreground/50 shrink-0">
                  {exp.startDate} &mdash; {exp.endDate || 'Present'}
                </span>
              </div>

              {exp.description && (
                <p className="text-sm text-foreground/85 leading-relaxed">
                  {exp.description}
                </p>
              )}

              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-xs font-mono uppercase text-foreground/40 tracking-wider">
                    Responsibilities
                  </span>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-foreground/75 space-y-1">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs font-mono rounded-md bg-foreground/5 text-foreground/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {exp.companyUrl && (
                <div className="pt-2 border-t border-foreground/5">
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <span>
                      {exp.company.toLowerCase().includes('cheating')
                        ? 'View Pull Request #370 (sohzm/cheating-daddy)'
                        : 'View Internship Certificate (InAmigos Foundation)'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </Container>
          ))}
        </div>
      </section>

      {/* Achievements & Certifications */}
      {achievements.length > 0 && (
        <section className="flex flex-col gap-4">
          <h1 className="text-xl md:text-2xl text-foreground">
            <span className="font-bold">My</span>{' '}
            <span className="text-foreground/50 text-sm">Achievements &</span>{' '}
            <span className="italic text-base font-light">Certifications</span>
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <Container
                key={ach.id}
                className="p-5 rounded-2xl flex flex-col gap-2.5 justify-between"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 w-fit">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-foreground/50">
                      {ach.dateAwarded}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground pt-1">
                    {ach.title}
                  </h3>
                  <p className="text-xs font-mono text-foreground/60">
                    Issued by {ach.issuer}
                  </p>
                  {ach.description && (
                    <p className="text-xs text-foreground/75 leading-relaxed pt-1">
                      {ach.description}
                    </p>
                  )}
                </div>

                {ach.credentialUrl && (
                  <a
                    href={ach.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground/60 hover:text-foreground transition-colors pt-2"
                  >
                    <span>View Certificate</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </Container>
            ))}
          </div>
        </section>
      )}

      {/* Cultural Interests / Cinema & Webseries Quick Links */}
      <section className="flex flex-col gap-4 pt-2">
        <h1 className="text-xl md:text-2xl text-foreground">
          <span className="font-bold">My</span>{' '}
          <span className="text-foreground/50 text-sm">Hobbies & </span>{' '}
          <span className="italic text-base font-light">Interests</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/about/hobbies/movies" className="group block h-full">
            <Container
              className="p-5 rounded-2xl border border-black/8 dark:border-white/8 bg-foreground/2 hover:bg-foreground/4 transition-all h-full"
              contentClassName="flex items-center justify-between h-full"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-foreground/6 text-foreground">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-amber-500 transition-colors">
                    Cinema &amp; Films
                  </h3>
                  <p className="text-xs font-mono text-foreground/50">
                    Marvel, DC, Kantara, KGF, Munjya &bull; 21 Films
                  </p>
                </div>
              </div>
              <span className="text-foreground/40 group-hover:text-foreground transition-colors">
                &rarr;
              </span>
            </Container>
          </Link>

          <Link href="/about/hobbies/webseries" className="group block h-full">
            <Container
              className="p-5 rounded-2xl border border-black/8 dark:border-white/8 bg-foreground/2 hover:bg-foreground/4 transition-all h-full"
              contentClassName="flex items-center justify-between h-full"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-foreground/6 text-foreground">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-amber-500 transition-colors">
                    Web Series &amp; TV
                  </h3>
                  <p className="text-xs font-mono text-foreground/50">
                    Money Heist, Panchayat, GoT, Mirzapur &bull; 9 Series
                  </p>
                </div>
              </div>
              <span className="text-foreground/40 group-hover:text-foreground transition-colors">
                &rarr;
              </span>
            </Container>
          </Link>

          <Link href="/about/hobbies/travel" className="group block h-full">
            <Container
              className="p-5 rounded-2xl border border-black/8 dark:border-white/8 bg-foreground/2 hover:bg-foreground/4 transition-all h-full"
              contentClassName="flex items-center justify-between h-full"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-foreground/6 text-foreground">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-amber-500 transition-colors">
                    Travel &amp; Expeditions
                  </h3>
                  <p className="text-xs font-mono text-foreground/50">
                    Nepal, Lumbini, Kushinagar, Agra &bull; 4 Expeditions
                  </p>
                </div>
              </div>
              <span className="text-foreground/40 group-hover:text-foreground transition-colors">
                &rarr;
              </span>
            </Container>
          </Link>
        </div>
      </section>
    </div>
  );
}
