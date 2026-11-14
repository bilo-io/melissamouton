import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { cn } from '@/vendor/midnite-ui';
import { useIsVisible } from '@/hooks/use-is-visible';

/**
 * Observes one element and adds `is-visible` once it scrolls into view. Children
 * with the `reveal` class (and an optional `--i` index) cascade in from there.
 */
export function RevealGroup({
  as: Tag = 'div',
  className,
  style,
  children,
  rootMargin,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  rootMargin?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const visible = useIsVisible(ref, rootMargin ? { rootMargin } : undefined);
  return (
    <Tag ref={ref} className={cn(className, visible && 'is-visible')} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/** Inline style helper for the cascade index. */
export const stagger = (i: number): CSSProperties => ({ '--i': i }) as CSSProperties;
