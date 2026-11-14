import { useEffect, useRef, type RefObject } from 'react';

/** How far a finger must travel sideways before a swipe counts. */
const SWIPE = 48;

/**
 * Sideways swipes on `ref` call `onSwipe` (+1 for next, -1 for previous). While the finger
 * moves, the element's `--swipe` variable follows it, damped at either end of the list (and
 * not at all under reduced motion). Touch and pen only, so a mouse can still select text.
 * Mostly vertical moves are left to the page's scroll; pair it with `touch-action: pan-y`.
 *
 * `glide`: on a successful swipe, `data-dragging` drops in the same frame as the change, so
 * whatever follows `--swipe` transitions on from where the finger left it. Without it, the
 * offset snaps to 0 first (for content that animates in on its own).
 */
export function useSwipe(
  ref: RefObject<HTMLElement | null>,
  onSwipe: (dir: 1 | -1) => void,
  canGo: (dir: 1 | -1) => boolean,
  { glide = false }: { glide?: boolean } = {},
) {
  const latest = useRef({ onSwipe, canGo });
  useEffect(() => {
    latest.current = { onSwipe, canGo };
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start: { x: number; y: number; id: number } | null = null;
    let sideways = false;
    // When the last sideways drag ended: the click a browser may send right after it (when
    // the drag began on a chevron) is swallowed. Keyboard clicks (detail 0) always pass.
    let dragEnd = -Infinity;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');

    const reset = () => {
      start = null;
      sideways = false;
      el.removeAttribute('data-dragging');
      el.style.setProperty('--swipe', '0px');
    };
    const down = (e: PointerEvent) => {
      dragEnd = -Infinity;
      if (e.pointerType === 'mouse' || !e.isPrimary) return;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    };
    const move = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!sideways) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        // Mostly vertical: a scroll, not a swipe.
        if (Math.abs(dy) > Math.abs(dx)) return reset();
        sideways = true;
        el.setAttribute('data-dragging', '');
      }
      if (still.matches) return;
      const blocked = !latest.current.canGo(dx < 0 ? 1 : -1);
      el.style.setProperty('--swipe', `${blocked ? dx * 0.25 : dx}px`);
    };
    const up = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return;
      const dx = e.clientX - start.x;
      const dir = dx < 0 ? 1 : -1;
      const go = sideways && Math.abs(dx) >= SWIPE && latest.current.canGo(dir);
      if (sideways) dragEnd = performance.now();
      if (go && glide) {
        reset();
        latest.current.onSwipe(dir);
      } else if (go) {
        // The new content slides in on its own, so drop the drag offset without springing back.
        start = null;
        sideways = false;
        el.style.setProperty('--swipe', '0px');
        requestAnimationFrame(() => el.removeAttribute('data-dragging'));
        latest.current.onSwipe(dir);
      } else reset();
    };

    const click = (e: MouseEvent) => {
      if (e.detail === 0 || performance.now() - dragEnd > 500) return;
      dragEnd = -Infinity;
      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('click', click, true);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', reset);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('click', click, true);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', reset);
    };
  }, [ref, glide]);
}
