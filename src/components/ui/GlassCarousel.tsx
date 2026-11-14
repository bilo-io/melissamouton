import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '@/vendor/midnite-ui';
import { useSwipe } from '@/hooks/use-swipe';
import { capitalize } from '@/utils/text';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/** `d` wrapped into (-n/2, n/2]: how many steps right (+) or left (-) of the selected card. */
const wrap = (d: number, n: number) => {
  const x = ((d % n) + n) % n;
  return x > n / 2 ? x - n : x;
};

/** Each card's place relative to the selected one; `gen` bumps when it jumps across the ring. */
type Place = { offset: number; gen: number };
type Ring = { active: number; places: Place[] };

const ringAt = (active: number, n: number, prev?: Ring, step = 0): Ring => ({
  active,
  places: Array.from({ length: n }, (_, i) => {
    const offset = wrap(i - active, n);
    const before = prev?.places[i];
    // A card that would have to cross the stage to get to its new side is remounted there.
    return { offset, gen: before ? before.gen + (before.offset - step === offset ? 0 : 1) : 0 };
  }),
});

/** What a card needs from the carousel: whether it is selected, and the props for its glass element. */
export interface CardSlot {
  selected: boolean;
  cardProps: {
    className: string;
    'data-spotlight'?: string;
    tabIndex?: number;
    onClick: (e: MouseEvent) => void;
  };
}

interface Props<T> {
  items: T[];
  keyOf: (item: T) => string;
  titleOf: (item: T) => string;
  /** The carousel's name ("Agentic workflows") and one item's ("workflow"), for its labels. */
  label: string;
  noun: string;
  /** How many cards show on either side of the selected one: 1 for neighbours, more to stack. */
  reach?: number;
  /** Turns to the next card every this many ms, while on screen and not hovered, focused or dragged. */
  interval?: number;
  renderCard: (item: T, index: number, slot: CardSlot) => ReactNode;
}

/**
 * A ring of glass cards: the selected one in the middle, `reach` smaller ones at either side,
 * wrapping round at both ends. Arrows, dots, arrow keys and (on touch) sideways swipes page it;
 * with `interval` it also turns on its own, and a button pauses it. The cards move by CSS
 * transitions on a `--pos` per card; the drag offset and the cursor glow are CSS variables, so
 * nothing re-renders per frame.
 */
export function GlassCarousel<T>(props: Props<T>) {
  return props.items.length ? <Ring {...props} /> : null;
}

function Ring<T>({ items, keyOf, titleOf, label, noun, reach = 1, interval, renderCard }: Props<T>) {
  const n = items.length;
  const [ring, setRing] = useState<Ring>(() => ringAt(0, n));
  const [paused, setPaused] = useState(false);
  const [autoplaying, setAutoplaying] = useState(false);
  const scheduleRef = useRef<() => void>(() => {});
  const reducedMotion = useReducedMotion();
  const { active } = ring;
  const regionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLUListElement>(null);

  /** Select card `to`, turning the ring the short way round. */
  const go = (to: number) =>
    setRing((prev) => (to === prev.active ? prev : ringAt(to, n, prev, wrap(to - prev.active, n))));
  /** Turn one card along, from wherever the ring is now (so quick repeats all count). */
  const turn = (dir: 1 | -1) =>
    setRing((prev) => (n > 1 ? ringAt((prev.active + dir + n) % n, n, prev, dir) : prev));

  // A turn by hand (arrows, dots, keys, swipes, a side card) stops the autoplay for good, as
  // carousel guidance asks; the play button starts it again.
  const byHand = <A extends unknown[]>(f: (...a: A) => void) => (...a: A) => {
    setPaused(true);
    f(...a);
  };
  const turnByHand = byHand(turn);
  const goByHand = byHand(go);

  useSwipe(stageRef, turnByHand, () => n > 1, { glide: true });

  // The selected card's drifting gradient runs only while the carousel is on screen.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([e]) => stage.toggleAttribute('data-live', e.isIntersecting));
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // Auto-advance. The listeners are set up once; `schedule` decides whether the ring may turn
  // and (re)starts the one timer. It holds while off screen, in a hidden tab, under reduced
  // motion, when paused (by the button or a turn by hand), or while the visitor points at, keyboard-focuses or drags
  // the carousel.
  useEffect(() => {
    const region = regionRef.current;
    const stage = stageRef.current;
    if (!interval || n < 2 || !region || !stage) {
      setAutoplaying(false);
      return;
    }
    let onScreen = false;
    let hovered = false;
    let timer = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      // Keyboard focus only: a tap or click that focuses a button should not stop it for good.
      const focused = !!region.querySelector(':focus-visible');
      const run =
        !paused && onScreen && !hovered && !focused && !document.hidden && !reducedMotion && !stage.hasAttribute('data-dragging');
      region.dataset.autoplay = run ? 'running' : 'paused';
      setAutoplaying(run);
      if (run) timer = window.setTimeout(() => turn(1), interval);
    };
    scheduleRef.current = schedule;
    // Seed `hovered` in case the pointer is already over the carousel.
    hovered = region.matches(':hover');
    schedule();
    const io = new IntersectionObserver(([e]) => {
      onScreen = !!e?.isIntersecting;
      schedule();
    });
    io.observe(stage);
    // Mouse only: a tap on a phone should not leave it paused for good.
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      hovered = true;
      schedule();
    };
    const onOut = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      hovered = false;
      schedule();
    };
    region.addEventListener('pointerenter', onOver);
    region.addEventListener('pointerleave', onOut);
    region.addEventListener('focusin', schedule);
    region.addEventListener('focusout', schedule);
    document.addEventListener('visibilitychange', schedule);
    const drag = new MutationObserver(schedule);
    drag.observe(stage, { attributes: true, attributeFilter: ['data-dragging'] });
    return () => {
      window.clearTimeout(timer);
      scheduleRef.current = () => {};
      io.disconnect();
      drag.disconnect();
      region.removeEventListener('pointerenter', onOver);
      region.removeEventListener('pointerleave', onOut);
      region.removeEventListener('focusin', schedule);
      region.removeEventListener('focusout', schedule);
      document.removeEventListener('visibilitychange', schedule);
    };
    // `turn` only calls setRing, so it need not be a dependency.
  }, [interval, n, paused, reducedMotion]);
  // Any turn, by hand or by timer, restarts the timer from the new card.
  useEffect(() => scheduleRef.current(), [active]);

  const current = items[active];
  const Noun = capitalize(noun);

  return (
    <div ref={regionRef} role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        ref={stageRef}
        className={cn('wf-stage -mx-4 sm:-mx-6 xl:-mx-12', reach > 1 && 'wf-stage--stack')}
        tabIndex={0}
        aria-label={`${Noun}s, use the arrow keys to page`}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            turnByHand(e.key === 'ArrowRight' ? 1 : -1);
          }
        }}
      >
        {items.map((item, i) => {
          const place = ring.places[i];
          const pos = Math.max(-(reach + 1), Math.min(reach + 1, place.offset));
          const selected = pos === 0;
          const shown = Math.abs(pos) <= reach;
          // A side card is a shortcut to itself: a click brings it to the middle instead of following it.
          const onClick = (e: MouseEvent) => {
            if (selected) return;
            e.preventDefault();
            goByHand(i);
          };
          return (
            <li
              key={`${keyOf(item)}-${place.gen}`}
              className={`wf-slide${place.gen ? ' wf-slide--in' : ''}`}
              data-pos={pos}
              style={{ '--pos': pos } as CSSProperties}
              aria-hidden={selected ? undefined : true}
              inert={!shown}
            >
              <div className="wf-frame" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${n}: ${titleOf(item)}`}>
                {renderCard(item, i, {
                  selected,
                  cardProps: {
                    className: 'wf-card group',
                    'data-spotlight': selected ? '' : undefined,
                    tabIndex: selected ? undefined : -1,
                    onClick,
                  },
                })}
              </div>
            </li>
          );
        })}
      </ul>
      {/* Silent while it turns on its own, so a screen reader is not interrupted every few seconds. */}
      <p className="sr-only" aria-live={autoplaying ? 'off' : 'polite'}>
        {`${Noun} ${active + 1} of ${n}: ${titleOf(current)}`}
      </p>

      {n > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button type="button" className="wf-glass-btn" onClick={() => turnByHand(-1)} aria-label={`Previous ${noun}`}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {items.map((item, i) => (
              <button
                key={keyOf(item)}
                type="button"
                className="wf-dot"
                aria-label={`Go to ${titleOf(item)}`}
                aria-current={i === active ? 'true' : undefined}
                onClick={() => goByHand(i)}
              />
            ))}
          </div>
          <button type="button" className="wf-glass-btn" onClick={() => turnByHand(1)} aria-label={`Next ${noun}`}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
          {interval && !reducedMotion ? (
            <button
              type="button"
              className="wf-glass-btn"
              onClick={() => setPaused((v) => !v)}
              aria-label={paused ? 'Play autoplay' : 'Pause autoplay'}
            >
              {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
