import { useEffect, useState, type RefObject } from 'react';

type Options = {
  /** Keep observing after the first hit (default false: reveal once). */
  repeat?: boolean;
  rootMargin?: string;
  threshold?: number;
};

/** True once the element has scrolled into view (IntersectionObserver). */
export const useIsVisible = (
  elementRef: RefObject<Element | null>,
  { repeat = false, rootMargin = '0px 0px -12% 0px', threshold = 0 }: Options = {},
): boolean => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [elementRef, repeat, rootMargin, threshold]);

  return isVisible;
};

export default useIsVisible;
