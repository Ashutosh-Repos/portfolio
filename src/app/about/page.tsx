import type { Metadata } from 'next';
import Link from 'next/link';
import { profileService } from '@/platform/modules/profile/profile.service';
import { educationService } from '@/platform/modules/education/education.service';
import { experienceService } from '@/platform/modules/experience/experience.service';
import { skillsService } from '@/platform/modules/skills/skills.service';
import { Container } from '@/components/liquid/Container';
import { GLASS_OPTICS } from '@/lib/glass-config';
import { EducationCard } from '@/components/Education/EducationCard';
import { Award, Film, Tv, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About — Ashutosh Kumar',
  description: 'Background, education, experience, achievements, and engineering journey of Ashutosh Kumar.',
};

export default async function AboutPage() {
  const [profile, educationList, experiences, skills, achievements] = await Promise.all([
    profileService.getProfile().catch(() => null),
    educationService.getEducationList().catch(() => []),
    experienceService.getExperiences().catch(() => []),
    skillsService.getSkills().catch(() => []),
    skillsService.getAchievements().catch(() => []),
  ]);

  // Group skills by category
  type SkillItem = (typeof skills)[number];
  const skillsByCategory: Record<string, SkillItem[]> = {};
  for (const s of skills) {
    const cat = s.category || 'other';
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(s);
  }

  const categoryTitles: Record<string, string> = {
    languages: 'Languages',
    networking: 'Backend & Networking',
    frameworks: 'Frontend & UI',
    databases: 'Databases & Storage',
    cloud_infra: 'Cloud & Infrastructure',
    ai_ml: 'AI & Machine Learning',
    tools: 'Developer Tools',
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 pt-4 pb-16">
      <Link
        href="/"
        className="text-sm font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
      >
        &larr; Back to Home
      </Link>

      {/* Hero / Bio Card */}
      <Container
        className="p-6 sm:p-8 rounded-[32px] bg-[#d5ede6]/25 dark:bg-[#1a3832]/25 transition-all duration-300 w-full"
        radius={36}
        optics={GLASS_OPTICS}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {profile?.name || 'Ashutosh Kumar'}
              </h1>
              <p className="text-sm sm:text-base text-foreground/60 font-mono pt-1">
                {profile?.headline || 'Software Engineer & Systems Builder'}
              </p>
            </div>
            {profile?.availabilityStatus && (
              <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {profile.availabilityStatus}
              </span>
            )}
          </div>

          <p className="text-base text-foreground/85 leading-relaxed pt-2">
            {profile?.bio ||
              'Crafting modern web architectures, distributed systems, and AI-native applications with an obsession for high-fidelity UI and low-latency backends.'}
          </p>

          {profile?.currentFocus && (
            <div className="p-3.5 rounded-2xl bg-foreground/[0.04] border border-black/5 dark:border-white/5 text-xs sm:text-sm font-mono text-foreground/80">
              <strong className="text-foreground">Current Focus:</strong> {profile.currentFocus}
            </div>
          )}
        </div>
      </Container>

      {/* Education Section with Photo Galleries */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Education</span>
            <span className="text-xs font-mono font-normal text-foreground/40 uppercase">Academic Journey &amp; Campuses</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {educationList.map((edu) => (
            <EducationCard key={edu.id} education={edu} />
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span>Experience</span>
          <span className="text-xs font-mono font-normal text-foreground/40 uppercase">Industry &amp; Open Source</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 sm:p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-foreground/[0.02] flex flex-col gap-3.5"
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
                      className="px-2 py-0.5 text-xs font-mono rounded-md bg-foreground/[0.05] text-foreground/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Achievements & Certifications */}
      {achievements.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Certifications &amp; Honors</span>
            <span className="text-xs font-mono font-normal text-foreground/40 uppercase">Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-foreground/[0.02] flex flex-col gap-2.5 justify-between"
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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Competencies / Technical Skills */}
      {skills.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Technical Skills</span>
            <span className="text-xs font-mono font-normal text-foreground/40 uppercase">Languages &amp; Stacks</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(skillsByCategory).map(([catKey, catSkills]) => (
              <div
                key={catKey}
                className="p-4 rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-foreground/[0.015] flex flex-col gap-2.5"
              >
                <h3 className="text-xs font-mono uppercase font-semibold text-foreground/50 tracking-wider">
                  {categoryTitles[catKey] || catKey}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {catSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2.5 py-1 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-foreground/[0.03] text-xs font-mono text-foreground/80"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cultural Interests / Cinema & Webseries Quick Links */}
      <section className="flex flex-col gap-4 pt-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span>Cinema &amp; Series</span>
          <span className="text-xs font-mono font-normal text-foreground/40 uppercase">Curated Catalog</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/about/hobbies/movies"
            className="group p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-foreground/[0.06] text-foreground">
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
            <span className="text-foreground/40 group-hover:text-foreground transition-colors">&rarr;</span>
          </Link>

          <Link
            href="/about/hobbies/webseries"
            className="group p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-foreground/[0.06] text-foreground">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-amber-500 transition-colors">
                  Web Series &amp; TV
                </h3>
                <p className="text-xs font-mono text-foreground/50">
                  Money Heist, Panchayat, Game of Thrones, Mirzapur &bull; 9 Series
                </p>
              </div>
            </div>
            <span className="text-foreground/40 group-hover:text-foreground transition-colors">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
