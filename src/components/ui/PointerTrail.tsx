import { useRef } from 'react';
import { usePointerTrail } from '@/hooks/use-pointer-trail';

const DOTS = Array.from({ length: 15 }, (_, i) => i);

/**
 * The glowing pointer and its trail, fixed over the page (`pointer-events: none`). The elements
 * stay in the DOM and are hidden by CSS until the hook marks the host ready, so there is
 * nothing to render per frame; see usePointerTrail and `.pointer-*` in index.css.
 */
export function PointerTrail() {
  const host = useRef<HTMLDivElement>(null);
  usePointerTrail(host);
  return (
    <div ref={host} aria-hidden className="pointer-fx" data-testid="pointer-fx">
      {DOTS.map((i) => (
        <span key={i} className="pointer-trail" style={{ '--n': i / DOTS.length } as React.CSSProperties} />
      ))}
      <span className="pointer-dot" />
    </div>
  );
}
