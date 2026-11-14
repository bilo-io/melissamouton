import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ChevronsLeftRight, Disc3, Mail, PenTool } from 'lucide-react';
import { GradientGlow, buttonVariants, cn } from '@/vendor/midnite-ui';
import { HERO, SIDES, profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { useSplitSeam } from '@/hooks/use-split-seam';

const at = (i: number) => ({ '--i': i }) as React.CSSProperties;
const EQ_BARS = Array.from({ length: 28 }, (_, i) => i);
/** Four of her project images, as the Design half's wall. */
const WALL = [projects[1].images[1], projects[2].images[0], projects[0].images[2], projects[4].images[0]];

function SideCard({ side, compact = false }: { side: keyof typeof SIDES; compact?: boolean }) {
  const s = SIDES[side];
  const Icon = side === 'trade' ? PenTool : Disc3;
  const right = side === 'heart';
  return (
    <div className={cn('split-card', right && 'text-right')}>
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">{s.tagline}</p>
      <p className={cn('mt-1 flex items-center gap-2 font-semibold', right && 'flex-row-reverse', compact ? 'text-base' : 'text-xl')}>
        <span className={cn('split-card-icon', right && 'split-card-icon--game')}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        {s.label}
      </p>
      {s.lines.length && !compact ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.lines[0]}</p> : null}
      <ul className={cn('mt-3 flex flex-wrap gap-1.5', right && 'justify-end')}>
        {s.chips.map((c) => (
          <li key={c} className="chip py-0 text-xs text-foreground">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Hero() {
  const [first, ...rest] = profile.name.split(' ');
  const hostRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  useSplitSeam(hostRef, stageRef, handleRef, HERO.sliderValue);

  return (
    <section ref={hostRef} className="split-hero relative overflow-hidden pb-16 pt-24 sm:pt-28">
      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h1 className="text-[clamp(2.75rem,9vw,5.75rem)] font-extrabold leading-[0.95] tracking-tighter">
          <span className="name-line lg:inline-block" style={at(0)}>
            {first}
          </span>{' '}
          <span className="name-line mui-rainbow-text mui-brand-glow pb-1 lg:inline-block" style={at(1)}>
            {rest.join(' ')}
          </span>
        </h1>
        <p className="hero-in mt-3 text-lg font-medium text-foreground/90 sm:text-xl" style={at(1)}>
          {profile.headline}
        </p>
        <p className="hero-in mt-1.5 text-sm font-medium text-muted-foreground sm:text-base" style={at(2)}>
          {HERO.trade} <span className="heading-gradient">{HERO.heart}</span>
        </p>
      </div>

      {/* The split stage: a wall per side and her portrait on both, wiped by a glowing seam. */}
      <div
        ref={stageRef}
        className="split-stage hero-in relative mt-4 h-[clamp(19rem,62vw,30rem)] w-full cursor-ew-resize touch-pan-y select-none lg:h-[min(31rem,56svh)]"
        style={at(2)}
      >
        <div aria-hidden className="split-wall">
          <div className="wall-heart">
            <div className="eq">
              {EQ_BARS.map((i) => (
                <span key={i} style={{ '--b': i } as React.CSSProperties} />
              ))}
            </div>
          </div>
          <div className="split-wall-left">
            <div className="wall-trade">
              {WALL.map((img) => (
                <img key={img.src} src={img.src} alt="" loading="lazy" decoding="async" draggable={false} />
              ))}
            </div>
          </div>
        </div>
        <div aria-hidden className="split-bloom" />

        <img
          src={profile.photo}
          alt=""
          aria-hidden
          width={720}
          height={720}
          draggable={false}
          className="split-portrait split-portrait--heart"
        />
        <div className="split-portrait-left">
          <img
            src={profile.photo}
            alt={profile.photoAlt}
            width={720}
            height={720}
            draggable={false}
            fetchPriority="high"
            className="split-portrait"
          />
        </div>

        <div className="split-side split-side--web hidden lg:block">
          <SideCard side="trade" />
        </div>
        <div className="split-side split-side--game hidden lg:block">
          <SideCard side="heart" />
        </div>

        <div className="split-seam">
          <span aria-hidden className="split-seam-line" />
          <div className="split-knob">
            <GradientGlow trigger="always" className="rounded-full">
              <button
                ref={handleRef}
                type="button"
                role="slider"
                aria-label={HERO.sliderLabel}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={50}
                aria-valuetext={HERO.sliderValue(50)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground"
              >
                <ChevronsLeftRight className="h-4 w-4" aria-hidden />
              </button>
            </GradientGlow>
          </div>
        </div>
      </div>

      {/* Below lg the copy sits under the stage, each half fading with its share. */}
      <div className="relative mx-auto mt-4 grid max-w-xl grid-cols-2 gap-3 px-4 lg:hidden">
        <div className="split-side-m split-side-m--web">
          <SideCard side="trade" compact />
        </div>
        <div className="split-side-m split-side-m--game">
          <SideCard side="heart" compact />
        </div>
      </div>

      <div className="relative mx-auto mt-8 flex max-w-6xl flex-col items-center gap-6 px-4 sm:px-6">
        <div className="hero-in relative z-20 flex flex-wrap items-center justify-center gap-3" style={at(3)}>
          <Link to="/projects" className="btn-glow">
            {HERO.cta.projects}
          </Link>
          <a href="#contact" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-11 rounded-xl bg-card/60')}>
            <Mail className="h-4 w-4" aria-hidden /> {HERO.cta.contact}
          </a>
        </div>

        <a href="#about" aria-label={HERO.scrollLabel} className="hero-in text-muted-foreground hover:text-foreground" style={at(4)}>
          <span className="animate-bob flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/60">
            <ArrowDown className="h-4 w-4" />
          </span>
        </a>
      </div>
    </section>
  );
}
