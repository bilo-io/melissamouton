import { useMemo, useRef } from 'react';
import { Quote } from 'lucide-react';
import { GradientGlow } from '@/vendor/midnite-ui';
import { profile } from '@/data/cv-profile';
import { RECOMMENDATIONS_URL, recommendations } from '@/data/cv-achievements';
import { RevealGroup, stagger } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TechIcon } from '@/components/ui/TechIcon';
import { useShimmer } from '@/hooks/use-shimmer';
import { intro } from '@/data/cv-cover-letters';
import { CoverLetterLinks } from './CoverLetterLinks';
import { letterFacts } from './experience-timeline';

/** Two sentences, one per line at every width; a shimmer alternates between them while on screen. */
function AboutTitle() {
  const host = useRef<HTMLSpanElement>(null);
  const trade = useRef<HTMLSpanElement>(null);
  const heart = useRef<HTMLSpanElement>(null);
  useShimmer([trade, heart], { first: [500, 900], gap: [3500, 5500], watch: host });

  return (
    <span ref={host} className="block text-[clamp(1.5rem,8vw,3rem)] leading-[1.12]">
      <span className="stack grid w-fit whitespace-nowrap">
        <span>Web dev by trade.</span>
        <span ref={trade} className="shimmer" aria-hidden>
          Web dev by trade.
        </span>
      </span>
      <span className="stack grid w-fit whitespace-nowrap">
        <span className="heading-gradient">Game dev at heart.</span>
        <span ref={heart} className="shimmer" aria-hidden>
          Game dev at heart.
        </span>
      </span>
    </span>
  );
}

export function About() {
  // The intro from the cover letters, with its computed figures; the letters follow it.
  const paragraphs = useMemo(() => intro(letterFacts(new Date(), false)), []);
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading eyebrow="01 · About" title={<AboutTitle />} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <RevealGroup className="surface lift p-6 sm:p-8">
          {paragraphs.map((p, i) => (
            <p key={i} className="reveal mb-4 text-base leading-relaxed text-foreground/85 sm:text-lg" style={stagger(i)}>
              {p}
            </p>
          ))}
          <CoverLetterLinks at={paragraphs.length} />
          <div className="reveal mt-8" style={stagger(paragraphs.length + 1)}>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Core technologies
            </p>
            <div className="flex flex-wrap gap-3">
              {profile.coreTech.map((code, i) => (
                <span key={code} className="reveal" data-from="zoom" style={stagger(paragraphs.length + 2 + i)}>
                  <TechIcon code={code} size={40} className="transition-transform duration-300 hover:-translate-y-1 hover:scale-110" />
                </span>
              ))}
            </div>
          </div>
        </RevealGroup>

        <RevealGroup className="flex flex-col gap-6">
          {recommendations.map((r, i) => (
            <div key={r.author} className="reveal" data-from="right" style={stagger(i + 1)}>
              <GradientGlow trigger="hover" className="p-6 sm:p-8">
                <figure>
                  <Quote className="mb-4 h-7 w-7 text-muted-foreground/60" aria-hidden />
                  <blockquote>
                    <p className="text-lg font-medium leading-snug sm:text-xl">“{r.quote}</p>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/75">{r.rest}”</p>
                  </blockquote>
                  <figcaption className="mt-5 text-sm text-muted-foreground">
                    <span className="block font-semibold text-foreground">{r.author}</span>
                    {r.title} ·{' '}
                    <a href={RECOMMENDATIONS_URL} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-foreground hover:underline">
                      on LinkedIn
                    </a>
                  </figcaption>
                </figure>
              </GradientGlow>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
