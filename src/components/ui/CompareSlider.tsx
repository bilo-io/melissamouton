import { useRef } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import type { IImage } from '@/data/projects';

/**
 * Before and after, as on the old ETHCC section: the "after" image over the "before", wiped by
 * a handle. The handle is a native range input; its value goes to a CSS variable on the host
 * directly (no React state), and the clip follows that variable.
 */
export function CompareSlider({
  before,
  after,
  label,
  beforeLabel,
  afterLabel,
}: {
  before: IImage;
  after: IImage;
  label: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  return (
    <div ref={host} className="compare relative select-none overflow-hidden" style={{ '--pos': '50%' } as React.CSSProperties} data-testid="compare">
      <img src={before.src} alt={before.alt} loading="lazy" decoding="async" className="block w-full" draggable={false} />
      <img src={after.src} alt={after.alt} loading="lazy" decoding="async" className="compare-after block w-full" draggable={false} />
      <span className="chip pointer-events-none absolute left-3 top-3 bg-background/80 text-foreground">{beforeLabel}</span>
      <span className="chip pointer-events-none absolute right-3 top-3 bg-background/80 text-foreground">{afterLabel}</span>
      <span aria-hidden className="compare-line" />
      <span aria-hidden className="compare-knob">
        <ChevronsLeftRight className="h-4 w-4" />
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        defaultValue={50}
        aria-label={label}
        className="compare-range"
        onInput={(e) => host.current?.style.setProperty('--pos', `${e.currentTarget.value}%`)}
      />
    </div>
  );
}
