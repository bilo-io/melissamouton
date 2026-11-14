import { DynamicBackground, NeuroCloudBackground, cn } from '@/vendor/midnite-ui';
import { useBackground } from '@/hooks/use-background';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * Half of Midnite's neuron count: the field reads the same, and every frame costs about
 * half as much, which matters on 8 GB laptops with many tabs open.
 */
const STARFIELD_DENSITY = 0.5;

/**
 * The fixed backdrop behind every page: a soft ambient wash, then the chosen
 * Midnite pattern. Starfield is the neuro-cloud canvas; the other patterns are
 * DynamicBackground canvases. Under reduced motion the starfield paints once and
 * the other patterns fall back to Midnite's static CSS twins.
 */
export function BackgroundLayer() {
  const { background } = useBackground();
  const reduced = useReducedMotion();

  let layer: React.ReactNode = null;
  if (background === 'starfield') {
    layer = <NeuroCloudBackground key="starfield" animate={!reduced} density={STARFIELD_DENSITY} />;
  } else if (background === 'none') {
    layer = <div className={cn('absolute inset-0', `bg-${background}`)} />;
  } else if (reduced) {
    const cls = background === 'gradient' ? 'bg-animated-gradient' : `bg-${background}`;
    layer = <div className={cn('absolute inset-0', cls)} />;
  } else {
    layer = <DynamicBackground key={background} pattern={background} />;
  }

  return (
    <div aria-hidden data-background={background} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ambient-wash absolute inset-0" />
      {layer}
      {/* Keeps long-form text readable over busy patterns. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/60" />
    </div>
  );
}
