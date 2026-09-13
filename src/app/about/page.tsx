import type { Metadata } from 'next';
import Link from 'next/link';
import { profileService } from '@/platform/modules/profile/profile.service';
import { educationService } from '@/platform/modules/education/education.service';
import { experienceService } from '@/platform/modules/experience/experience.service';
import { skillsService } from '@/platform/modules/skills/skills.service';
import { Container } from '@/components/liquid/Container';
import { GLASS_OPTICS } from '@/lib/glass-config';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About — Ashutosh Kumar',
  description: 'Background, education, experience, and engineering journey of Ashutosh Kumar.',
};

export default async function AboutPage() {
  const [profile, educationList, experiences, skills] = await Promise.all([
    profileService.getProfile().catch(() => null),
    educationService.getEducationList().catch(() => []),
    experienceService.getExperiences().catch(() => []),
    skillsService.getSkills({ featuredOnly: true }).catch(() => []),
  ]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pt-4 pb-16">
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

      {/* Education Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span>Education</span>
          <span className="text-xs font-mono font-normal text-foreground/40 uppercase">Academic Foundation</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {educationList.map((edu) => (
            <div
              key={edu.id}
              className="p-5 sm:p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-foreground/[0.02] flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  {edu.institution}
                </h3>
                <span className="text-xs font-mono text-foreground/50">
                  {edu.startDate} &mdash; {edu.endDate || 'Present'}
                </span>
              </div>

              <div className="text-sm text-foreground/75 font-mono">
                {edu.degree} in {edu.fieldOfStudy}
                {edu.gradeOrCgpa && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-md bg-foreground/[0.06] text-foreground/70">
                    {edu.gradeOrCgpa}
                  </span>
                )}
              </div>

              {edu.description && (
                <p className="text-sm text-foreground/80 leading-relaxed pt-1">
                  {edu.description}
                </p>
              )}

              {edu.highlights && edu.highlights.length > 0 && (
                <ul className="list-disc list-inside text-xs sm:text-sm text-foreground/70 space-y-1 pt-1">
                  {edu.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span>Experience</span>
          <span className="text-xs font-mono font-normal text-foreground/40 uppercase">Industry & Open Source</span>
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

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Core Competencies</span>
            <span className="text-xs font-mono font-normal text-foreground/40 uppercase">Technologies</span>
          </h2>

          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="px-3 py-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-foreground/[0.03] flex items-center gap-2 text-xs sm:text-sm font-mono text-foreground/80"
              >
                <span>{skill.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-foreground/[0.08] text-foreground/60 capitalize">
                  {skill.proficiencyTier}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
