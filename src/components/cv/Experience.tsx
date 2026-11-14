import { Briefcase, GraduationCap } from 'lucide-react';
import { EDUCATION, EXPERIENCE, profile } from '@/data/profile';
import { SITE_COPY } from '@/data/site';
import { RevealGroup, stagger } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Experience() {
  const copy = SITE_COPY.experience;
  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading eyebrow={copy.eyebrow} title={copy.title} />

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <RevealGroup className="relative space-y-5 pl-6 before:absolute before:bottom-3 before:left-2 before:top-3 before:w-px before:bg-border/80">
          {EXPERIENCE.map((entry, idx) => (
            <article key={entry.organization} className="reveal surface lift relative p-5 sm:p-6" style={stagger(idx)}>
              <span
                aria-hidden
                className="absolute -left-[1.35rem] top-6 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-primary"
              >
                <Briefcase className="h-3 w-3" />
              </span>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold tracking-tight">{entry.organization}</h3>
                <p className="font-mono text-xs text-muted-foreground">{entry.meta}</p>
              </div>
              <ul className="mt-3 space-y-3">
                {entry.roles.map((role) => (
                  <li key={`${role.title}-${role.period}`} className="border-l-2 border-border/60 pl-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{role.title}</p>
                      <span className="font-mono text-xs text-muted-foreground">{role.period}</span>
                    </div>
                    {role.summary ? <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{role.summary}</p> : null}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </RevealGroup>

        <div className="space-y-6">
          <RevealGroup className="surface lift p-6">
            <h3 className="reveal flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground" style={stagger(0)}>
              <GraduationCap className="h-4 w-4" aria-hidden /> {copy.education}
            </h3>
            <ul className="mt-4 space-y-4">
              {EDUCATION.map((ed, idx) => (
                <li key={ed.institution} className="reveal border-l-2 border-border/60 pl-3" style={stagger(idx + 1)}>
                  <p className="text-sm font-semibold">{ed.institution}</p>
                  <p className="text-sm text-foreground/85">{ed.credential}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">{ed.period}</p>
                </li>
              ))}
            </ul>
          </RevealGroup>

          <RevealGroup className="surface lift p-6">
            <h3 className="reveal font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground" style={stagger(0)}>
              {copy.skills}
            </h3>
            <ul className="reveal mt-3 flex flex-wrap gap-2" style={stagger(1)}>
              {profile.skills.map((skill) => (
                <li key={skill} className="chip text-xs text-foreground">
                  {skill}
                </li>
              ))}
            </ul>

            <h3 className="reveal mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground" style={stagger(2)}>
              {copy.languages}
            </h3>
            <ul className="reveal mt-2 space-y-1 text-sm text-foreground/85" style={stagger(3)}>
              {profile.languages.map((lang) => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
