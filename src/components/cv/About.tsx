import { useRef } from 'react';
import { Mail } from 'lucide-react';
import { GradientGlow } from '@/vendor/midnite-ui';
import { HERO, profile } from '@/data/profile';
import { SITE_COPY } from '@/data/site';
import { RevealGroup, stagger } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useShimmer } from '@/hooks/use-shimmer';

/** Two sentences, one per line at every width; a shimmer alternates between them while on screen. */
function AboutTitle() {
  const host = useRef<HTMLSpanElement>(null);
  const trade = useRef<HTMLSpanElement>(null);
  const heart = useRef<HTMLSpanElement>(null);
  useShimmer([trade, heart], { first: [500, 900], gap: [3500, 5500], watch: host });

  return (
    <span ref={host} className="block text-[clamp(1.5rem,8vw,3rem)] leading-[1.12]">
      <span className="stack grid w-fit whitespace-nowrap">
        <span>{HERO.trade}</span>
        <span ref={trade} className="shimmer" aria-hidden>
          {HERO.trade}
        </span>
      </span>
      <span className="stack grid w-fit whitespace-nowrap">
        <span className="heading-gradient">{HERO.heart}</span>
        <span ref={heart} className="shimmer" aria-hidden>
          {HERO.heart}
        </span>
      </span>
    </span>
  );
}

export function About() {
  const { about } = profile;
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading eyebrow={SITE_COPY.about.eyebrow} title={<AboutTitle />} />

      <div className="grid items-stretch gap-6 lg:grid-cols-[1.4fr_1fr]">
        <RevealGroup className="surface lift p-6 sm:p-8">
          <h3 className="reveal text-xl font-semibold leading-snug sm:text-2xl" style={stagger(0)}>
            {about.title}
          </h3>
          <p className="reveal mt-5 text-base leading-relaxed text-foreground/85 sm:text-lg" style={stagger(1)}>
            {about.subtitle}
          </p>
          <p className="reveal mt-8" style={stagger(2)}>
            <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">{about.contactLead}</span>
            <a href={`mailto:${profile.email}`} className="mt-2 inline-flex items-center gap-2 text-lg font-semibold hover:underline">
              <Mail className="h-5 w-5" aria-hidden /> {profile.email}
            </a>
          </p>
        </RevealGroup>

        <RevealGroup className="flex">
          <div className="reveal flex-1" data-from="right">
            <GradientGlow trigger="hover" className="flex h-full min-h-[18rem] items-end justify-center overflow-hidden px-6 pt-6">
              <img
                src={profile.photo}
                alt={profile.photoAlt}
                width={720}
                height={720}
                loading="lazy"
                decoding="async"
                className="max-h-[26rem] w-auto max-w-full object-contain"
              />
            </GradientGlow>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
