import { Mail } from 'lucide-react';
import { GradientGlow, buttonVariants, cn } from '@/vendor/midnite-ui';
import { profile } from '@/data/profile';
import { SITE_COPY } from '@/data/site';
import { RevealGroup, stagger } from '@/components/ui/Reveal';

export function Contact() {
  const c = SITE_COPY.contact;
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <RevealGroup>
        <div className="reveal" data-from="zoom">
          <GradientGlow trigger="always" className="relative overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="hero-orb left-[calc(50%-10rem)] top-0 h-80 w-80"
              style={{ background: 'radial-gradient(circle, hsl(var(--glow-2) / var(--glow-strength)), transparent 65%)' }}
            />
            <div className="relative">
              <p className="reveal font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground" style={stagger(1)}>
                {c.eyebrow}
              </p>
              <h2 className="reveal mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl" style={stagger(2)}>
                {c.title[0]} <span className="mui-rainbow-text">{c.title[1]}</span>
              </h2>
              <div className="reveal mt-8 flex flex-wrap justify-center gap-3" style={stagger(3)}>
                <a href={`mailto:${profile.email}`} className={cn(buttonVariants({ size: 'lg' }), 'h-11 rounded-xl')}>
                  <Mail className="h-4 w-4" aria-hidden /> {profile.email}
                </a>
              </div>
            </div>
          </GradientGlow>
        </div>
      </RevealGroup>
    </section>
  );
}
