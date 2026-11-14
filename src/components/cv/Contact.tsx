import { Download, Mail, MapPin } from 'lucide-react';
import { GradientGlow, buttonVariants, cn } from '@/vendor/midnite-ui';
import { profile } from '@/data/cv-profile';
import { RevealGroup, stagger } from '@/components/ui/Reveal';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { CvDownloadMenu, CvMenuChevron } from './CvDownloadMenu';

export function Contact() {
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
                07 · Contact
              </p>
              <h2 className="reveal mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl" style={stagger(2)}>
                Still here? <span className="mui-rainbow-text">Let&apos;s talk.</span>
              </h2>
              <p className="reveal mx-auto mt-4 max-w-xl text-muted-foreground" style={stagger(3)}>
                <MapPin className="mr-1 inline h-4 w-4 align-[-2px]" aria-hidden />
                {profile.location}
              </p>
              <div className="reveal mt-8 flex flex-wrap justify-center gap-3" style={stagger(4)}>
                <a
                  href={`mailto:${profile.email}?subject=${encodeURIComponent('Hello from bilo.dev')}`}
                  className={cn(buttonVariants({ size: 'lg' }), 'h-11 rounded-xl')}
                >
                  <Mail className="h-4 w-4" aria-hidden /> {profile.email}
                </a>
                <CvDownloadMenu up>
                  {(trigger, open) => (
                    <button {...trigger} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-11 rounded-xl')}>
                      <Download className="h-4 w-4" aria-hidden /> CV (PDF)
                      <CvMenuChevron open={open} />
                    </button>
                  )}
                </CvDownloadMenu>
              </div>
              <div className="reveal mt-8 flex justify-center" style={stagger(5)}>
                <SocialLinks />
              </div>
            </div>
          </GradientGlow>
        </div>
      </RevealGroup>
    </section>
  );
}
