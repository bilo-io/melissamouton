import { useEffect, type RefObject } from 'react';

const IDLE_MS = 2600; // pointer quiet for this long → auto sweep resumes
const SWEEP_MS = 9000; // one full auto-sweep cycle
const SWEEP_AMPLITUDE = 0.3;
const SWEEP_CYCLES = 2; // then settle at 50/50 and stop the loop
const DRAG_SLOP = 8; // px of horizontal travel before a touch becomes a drag
const EDGE = 0.04; // keep the seam off the very edges
const KEY_STEP = 0.05;

const clamp = (v: number, lo = EDGE, hi = 1 - EDGE) => Math.min(hi, Math.max(lo, v));

type Mode = 'idle' | 'hover' | 'drag' | 'pinned';

/**
 * Drives the hero's split seam without React renders: writes `--split` (0..1, the seam's
 * position from the left of the stage) on `host` from one rAF loop.
 *
 * - Hover (fine pointer): mirrored like the original DualPanel, so the side you point at grows.
 * - Drag (anywhere on the stage): moves the seam by the pointer's travel, so it never snaps.
 *   Touch drags start only after horizontal travel, so vertical scrolls pass through.
 *   A mouse drag pins the seam until the pointer leaves the hero.
 * - Keyboard: the handle is a slider; arrows nudge, Home/End jump.
 * - Idle: two slow sine sweeps, so touch users see the effect, then it settles at 50/50.
 * - Reduced motion: static 50/50, no hover or sweep; drag and keys still move it, without easing.
 */
export function useSplitSeam(
  hostRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
  handleRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const host = hostRef.current;
    const stage = stageRef.current;
    const handle = handleRef.current;
    if (!host || !stage) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let current = 0.5;
    let target = 0.5;
    let mode: Mode = 'idle';
    let lastInput = -Infinity;
    let pendingX: number | null = null;
    let dragId: number | null = null;
    let candidate: { id: number; x: number; y: number } | null = null;
    let dragStartX = 0;
    let dragStartSplit = 0.5;
    let idleSince = performance.now();
    let sweepPhase: number | null = null; // sine phase that starts the sweep from where the seam is
    let wake = 0; // timeout that restarts the loop when the idle wait ends
    let raf = 0;
    let last = performance.now();
    let onScreen = true;
    let shownValue = -1;

    const write = () => {
      host.style.setProperty('--split', current.toFixed(4));
      const pct = Math.round(current * 100);
      if (handle && pct !== shownValue) {
        shownValue = pct;
        handle.setAttribute('aria-valuenow', String(pct));
        handle.setAttribute('aria-valuetext', `Web dev ${pct}%, game dev ${100 - pct}%`);
      }
    };

    const sweepStart = () => Math.max(idleSince, lastInput + IDLE_MS);
    const sweeping = (now: number) =>
      !reduced && mode === 'idle' && now > sweepStart() && now - sweepStart() < SWEEP_CYCLES * SWEEP_MS;

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(64, now - last);
      last = now;

      if (pendingX !== null) {
        const r = stage.getBoundingClientRect();
        target =
          mode === 'drag'
            ? clamp(dragStartSplit + (pendingX - dragStartX) / r.width)
            : 1 - clamp((pendingX - r.left) / r.width);
        pendingX = null;
      }
      if (sweeping(now)) {
        // Start the sine where the seam already is, so the sweep picks up without a jump.
        sweepPhase ??= Math.asin(Math.max(-1, Math.min(1, (current - 0.5) / SWEEP_AMPLITUDE)));
        target = 0.5 + SWEEP_AMPLITUDE * Math.sin(sweepPhase + ((now - sweepStart()) / SWEEP_MS) * Math.PI * 2);
      } else if (!reduced && mode === 'idle' && now - sweepStart() >= SWEEP_CYCLES * SWEEP_MS) {
        target = 0.5;
      }

      // Frame-rate independent lerp: the seam trails its target.
      const base = mode === 'drag' ? 0.35 : sweeping(now) ? 0.04 : 0.1;
      const k = reduced ? 1 : 1 - Math.pow(1 - base, dt / 16.67);
      current += (target - current) * k;
      write();

      if (!onScreen) return;
      if (sweeping(now) || Math.abs(target - current) > 0.0005) {
        schedule();
      } else if (!reduced && mode === 'idle' && now <= sweepStart()) {
        // Settled while waiting to sweep: sleep instead of spinning frames.
        clearTimeout(wake);
        wake = window.setTimeout(schedule, sweepStart() - now + 16);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const input = () => {
      lastInput = performance.now();
      sweepPhase = null;
      schedule();
    };

    const onHostMove = (e: PointerEvent) => {
      if (reduced || !fineHover || e.pointerType !== 'mouse') return;
      if (mode === 'drag' || mode === 'pinned') return;
      mode = 'hover';
      pendingX = e.clientX;
      input();
    };

    const goIdle = () => {
      mode = 'idle';
      idleSince = performance.now();
      input();
    };

    const onHostLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || mode === 'drag') return;
      goIdle();
    };

    const startDrag = (id: number, x: number) => {
      dragId = id;
      candidate = null;
      mode = 'drag';
      dragStartX = x;
      dragStartSplit = current;
      target = current;
      stage.setPointerCapture(id);
      input();
    };

    const onDown = (e: PointerEvent) => {
      // Every pointer must travel sideways before it drags, so clicks and vertical scrolls pass through.
      if (e.button !== 0) return;
      candidate = { id: e.pointerId, x: e.clientX, y: e.clientY };
    };

    const onMove = (e: PointerEvent) => {
      if (candidate && e.pointerId === candidate.id) {
        const dx = e.clientX - candidate.x;
        const dy = e.clientY - candidate.y;
        if (Math.abs(dx) > DRAG_SLOP && Math.abs(dx) > Math.abs(dy)) startDrag(e.pointerId, candidate.x);
        else return;
      }
      if (e.pointerId !== dragId) return;
      pendingX = e.clientX;
      input();
    };

    const onUp = (e: PointerEvent) => {
      if (candidate?.id === e.pointerId) candidate = null;
      if (e.pointerId !== dragId) return;
      dragId = null;
      if (e.pointerType === 'mouse' && e.type === 'pointerup') {
        mode = 'pinned';
        input();
      } else {
        goIdle();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const keys: Record<string, number> = {
        ArrowLeft: target - KEY_STEP,
        ArrowDown: target - KEY_STEP,
        ArrowRight: target + KEY_STEP,
        ArrowUp: target + KEY_STEP,
        Home: EDGE,
        End: 1 - EDGE,
      };
      if (!(e.key in keys)) return;
      e.preventDefault();
      mode = 'pinned';
      target = clamp(keys[e.key]);
      input();
    };
    // Focus holds the seam still, so the sweep doesn't keep changing what a screen reader announces.
    const onFocus = () => {
      // Keyboard focus only: a mouse or touch press on the knob shouldn't freeze the sweep.
      if (mode !== 'drag' && handle?.matches(':focus-visible')) {
        mode = 'pinned';
        target = current;
        input();
      }
    };
    const onBlur = () => {
      if (mode === 'pinned') goIdle();
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = !!entry?.isIntersecting;
      if (onScreen) {
        last = performance.now();
        schedule();
      }
    });
    io.observe(host);

    host.addEventListener('pointermove', onHostMove, { passive: true });
    host.addEventListener('pointerleave', onHostLeave);
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove, { passive: true });
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    stage.addEventListener('lostpointercapture', onUp);
    handle?.addEventListener('keydown', onKey);
    handle?.addEventListener('focus', onFocus);
    handle?.addEventListener('blur', onBlur);

    write();
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(wake);
      io.disconnect();
      host.removeEventListener('pointermove', onHostMove);
      host.removeEventListener('pointerleave', onHostLeave);
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onUp);
      stage.removeEventListener('lostpointercapture', onUp);
      handle?.removeEventListener('keydown', onKey);
      handle?.removeEventListener('focus', onFocus);
      handle?.removeEventListener('blur', onBlur);
    };
  }, [hostRef, stageRef, handleRef]);
}
