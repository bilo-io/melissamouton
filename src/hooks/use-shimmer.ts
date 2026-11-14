import { useEffect, useRef, type RefObject } from 'react';

type Range = [min: number, max: number];
const pick = ([a, b]: Range) => a + Math.random() * (b - a);

export interface ShimmerOptions {
  /** Wait before the first sweep, ms, counted from when sweeping can first run. */
  first: Range;
  /** Wait between sweeps, ms. */
  gap: Range;
  /** Only sweep while this element is on screen. Omit to sweep whenever the tab is visible. */
  watch?: RefObject<Element | null>;
}

/**
 * Drives the shared `.shimmer` sweep (see index.css): adds `is-shimmering` to each target in
 * turn, waiting `gap` between sweeps. Timers only, no per-frame work. Pauses while the tab is
 * hidden or `watch` is off screen; does nothing under prefers-reduced-motion.
 * Options are read once, on mount.
 */
export function useShimmer(targets: RefObject<HTMLElement | null>[], options: ShimmerOptions) {
  const config = useRef({ targets, ...options });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { targets, first, gap, watch } = config.current;
    let timer = 0;
    let fallback = 0;
    let index = 0;
    let started = false;
    let busy = false;
    let inView = !watch;

    const canRun = () => inView && !document.hidden;

    const schedule = () => {
      window.clearTimeout(timer);
      if (busy || !canRun()) return;
      timer = window.setTimeout(sweep, pick(started ? gap : first));
    };

    const sweep = () => {
      if (!canRun()) return;
      const el = targets[index % targets.length]?.current;
      index += 1;
      started = true;
      if (!el) return schedule();
      busy = true;
      const done = () => {
        window.clearTimeout(fallback);
        el.removeEventListener('animationend', onEnd);
        el.classList.remove('is-shimmering');
        busy = false;
        schedule();
      };
      const onEnd = (e: AnimationEvent) => {
        if (e.animationName === 'shimmer-sweep') done();
      };
      el.addEventListener('animationend', onEnd);
      // If the animation never ends (element hidden mid-sweep), free the loop anyway.
      fallback = window.setTimeout(done, 3000);
      el.classList.add('is-shimmering');
    };

    const onVisibility = () => (document.hidden ? window.clearTimeout(timer) : schedule());
    document.addEventListener('visibilitychange', onVisibility);

    let io: IntersectionObserver | undefined;
    const node = watch?.current;
    if (node) {
      io = new IntersectionObserver(([entry]) => {
        inView = !!entry?.isIntersecting;
        if (inView) schedule();
        else window.clearTimeout(timer);
      });
      io.observe(node);
    } else {
      schedule();
    }

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(fallback);
      document.removeEventListener('visibilitychange', onVisibility);
      io?.disconnect();
      targets.forEach((t) => t.current?.classList.remove('is-shimmering'));
    };
  }, []);
}
