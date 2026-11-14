import { useEffect, type RefObject } from 'react';

/** Trail dots behind the glowing cursor, as on the old site. */
const TRAIL = 15;

/**
 * Melissa's pointer effect: a glowing dot that eases after the mouse, with a chain of small dots
 * trailing it (each follows the one before at its own speed, smaller and fainter down the chain).
 * The dot grows while a mouse button is held.
 *
 * Built on the bilo house rules: one rAF loop writes `--x` and `--y` on the elements (no React
 * state per frame), the loop sleeps once everything has settled and while the tab is hidden,
 * and the whole effect stays off under prefers-reduced-motion and on devices with no fine,
 * hovering pointer (touch-only). `host` holds the `.pointer-dot` and `.pointer-trail` elements.
 */
export function usePointerTrail(host: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let stop: (() => void) | null = null;

    const start = () => {
      const dot = root.querySelector<HTMLElement>('.pointer-dot');
      const trail = [...root.querySelectorAll<HTMLElement>('.pointer-trail')];
      if (!dot) return () => {};

      const pointer = { x: 0, y: 0 };
      const head = { x: 0, y: 0 };
      const nodes = trail.map((el, i) => ({
        el,
        x: 0,
        y: 0,
        // Each dot's own pull, as the old site's random 0.1 to 0.2, but fixed so renders agree.
        speed: 0.1 + (((i * 37) % 10) / 10) * 0.1,
      }));
      let seen = false;
      let raf = 0;
      let last = performance.now();

      const place = (el: HTMLElement, x: number, y: number) => {
        el.style.setProperty('--x', `${x.toFixed(1)}px`);
        el.style.setProperty('--y', `${y.toFixed(1)}px`);
      };

      const tick = (now: number) => {
        raf = 0;
        // Frame-rate independent: the old site's 0.2 head easing and per-dot speeds are per 60 Hz frame.
        const f = Math.min(4, (now - last) / 16.67);
        last = now;
        const k = (rate: number) => 1 - Math.pow(1 - rate, f);

        head.x += (pointer.x - head.x) * k(0.2);
        head.y += (pointer.y - head.y) * k(0.2);
        place(dot, head.x, head.y);

        let px = head.x;
        let py = head.y;
        let moving = Math.abs(pointer.x - head.x) + Math.abs(pointer.y - head.y) > 0.1;
        for (const n of nodes) {
          n.x += (px - n.x) * k(n.speed);
          n.y += (py - n.y) * k(n.speed);
          place(n.el, n.x, n.y);
          if (Math.abs(px - n.x) + Math.abs(py - n.y) > 0.1) moving = true;
          px = n.x;
          py = n.y;
        }
        if (moving && !document.hidden) schedule();
      };

      const schedule = () => {
        if (!raf && !document.hidden) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        if (!seen) {
          // First move: start from the pointer, so nothing flies in from the corner.
          seen = true;
          head.x = pointer.x;
          head.y = pointer.y;
          for (const n of nodes) {
            n.x = pointer.x;
            n.y = pointer.y;
          }
          root.setAttribute('data-active', '');
        }
        schedule();
      };
      const onLeave = () => root.removeAttribute('data-active');
      const onEnter = () => seen && root.setAttribute('data-active', '');
      const onDown = (e: PointerEvent) => e.pointerType === 'mouse' && root.setAttribute('data-down', '');
      const onUp = () => root.removeAttribute('data-down');
      const onVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(raf);
          raf = 0;
          root.removeAttribute('data-active');
        } else if (seen) {
          root.setAttribute('data-active', '');
          schedule();
        }
      };

      document.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerdown', onDown, { passive: true });
      document.addEventListener('pointerup', onUp, { passive: true });
      document.addEventListener('pointercancel', onUp, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      document.documentElement.addEventListener('pointerenter', onEnter);
      document.addEventListener('visibilitychange', onVisibility);
      root.setAttribute('data-ready', '');

      return () => {
        cancelAnimationFrame(raf);
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerdown', onDown);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('pointercancel', onUp);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        document.documentElement.removeEventListener('pointerenter', onEnter);
        document.removeEventListener('visibilitychange', onVisibility);
        root.removeAttribute('data-ready');
        root.removeAttribute('data-active');
        root.removeAttribute('data-down');
      };
    };

    const sync = () => {
      stop?.();
      stop = fine.matches && !reduced.matches ? start() : null;
    };
    sync();
    fine.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      fine.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
      stop?.();
    };
  }, [host]);
}
