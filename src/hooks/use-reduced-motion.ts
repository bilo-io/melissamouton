import { useMediaQuery } from './use-media-query';

/** Live `prefers-reduced-motion` flag. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
