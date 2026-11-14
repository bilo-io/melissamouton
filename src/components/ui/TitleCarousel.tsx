import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useSwipe } from '@/hooks/use-swipe';
import { capitalize } from '@/utils/text';

/** One page the title can turn to. */
export interface TitleItem {
  key: string;
  title: string;
  to: string;
}

function Chevron({ to, dir, size, noun }: { to?: TitleItem; dir: 1 | -1; size: 'lg' | 'sm'; noun: string }) {
  const Icon = dir === 1 ? ChevronRight : ChevronLeft;
  const label = `${dir === 1 ? 'Next' : 'Previous'} ${noun}`;
  const cls = size === 'lg' ? 'wf-chevron' : 'wf-chevron wf-chevron--sm';
  const icon = <Icon className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} aria-hidden />;
  return to ? (
    <Link to={to.to} className={cls} aria-label={`${label}: ${to.title}`}>
      {icon}
    </Link>
  ) : (
    <span className={cls} aria-label={label} aria-disabled="true" role="link">
      {icon}
    </span>
  );
}

/**
 * A detail page's title as a carousel: the title centred between previous and next chevrons,
 * a dot per page, and swipes to turn. Once the title scrolls under the top bar, a slim copy
 * docks beneath it with the same controls. `noun` names one page ("workflow") for the labels
 * and test ids; `children` sit between the title and the dots.
 */
export function TitleCarousel({
  items,
  index,
  eyebrow,
  noun,
  children,
}: {
  items: TitleItem[];
  index: number;
  eyebrow: ReactNode;
  noun: string;
  children?: ReactNode;
}) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const item = items[index];
  const prev = items[index - 1];
  const next = items[index + 1];
  const Noun = capitalize(noun);

  // Which way the title came in, so it slides from the side it was swiped or clicked from.
  // Kept in state (adjusted while rendering) so a later re-render keeps the same animation.
  const [shown, setShown] = useState({ index, from: 0 });
  if (shown.index !== index) setShown({ index, from: index > shown.index ? 1 : -1 });
  const from = shown.index === index ? shown.from : index > shown.index ? 1 : -1;

  const go = (dir: 1 | -1) => {
    const to = items[index + dir];
    if (to) navigate(to.to);
  };
  const canGo = (dir: 1 | -1) => Boolean(items[index + dir]);

  const head = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  useSwipe(head, go, canGo);
  useSwipe(bar, go, canGo);

  // Show the compact bar once the full title has scrolled up under the top bar.
  useEffect(() => {
    const el = head.current;
    const compact = bar.current;
    if (!el || !compact) return;
    const show = (on: boolean) => {
      compact.toggleAttribute('data-shown', on);
      compact.inert = !on;
    };
    show(false);
    // The bar's CSS `top` docks it under the fixed top bar; the title counts as gone once it
    // passes that same line.
    const dock = parseFloat(getComputedStyle(compact).top) || 0;
    const io = new IntersectionObserver(([e]) => show(!e.isIntersecting && e.boundingClientRect.top < dock), {
      rootMargin: `-${dock}px 0px 0px 0px`,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const slide = { '--from': from } as CSSProperties;
  const enter = from && !reduced ? 'wf-title-in' : 'name-line';

  return (
    <>
      <header className="text-center">
        {eyebrow}
        <div ref={head} className="wf-title-row mt-2" data-testid={`${noun}-title`}>
          <Chevron to={prev} dir={-1} size="lg" noun={noun} />
          <div className="wf-title-track">
            <h1 key={item.key} className={`${enter} text-balance break-words text-3xl font-extrabold tracking-tight sm:text-6xl`} style={slide}>
              {item.title}
            </h1>
          </div>
          <Chevron to={next} dir={1} size="lg" noun={noun} />
        </div>
        {children}
        <nav aria-label={`${Noun}s`} className="hero-in mt-5 flex flex-wrap items-center justify-center gap-2" style={{ '--i': 1 } as CSSProperties}>
          {items.map((x) => (
            <Link
              key={x.key}
              to={x.to}
              className="wf-dot"
              aria-label={`Go to ${x.title}`}
              aria-current={x === item ? 'page' : undefined}
            />
          ))}
        </nav>
      </header>

      <div ref={bar} className="wf-compact" data-testid={`${noun}-compact-bar`} aria-label={Noun} role="navigation">
        <div className="mx-auto flex h-12 max-w-5xl items-center gap-2 px-4 sm:px-6">
          <Chevron to={prev} dir={-1} size="sm" noun={noun} />
          <div className="wf-title-track flex-1">
            <p key={item.key} className={`${from && !reduced ? 'wf-title-in' : ''} truncate text-center text-base font-bold tracking-tight`} style={slide}>
              {item.title}
            </p>
          </div>
          <span className="font-mono text-xs tabular-nums text-muted-foreground" aria-hidden>
            {index + 1}/{items.length}
          </span>
          <span className="sr-only">
            {index + 1} of {items.length}
          </span>
          <Chevron to={next} dir={1} size="sm" noun={noun} />
        </div>
      </div>
    </>
  );
}
