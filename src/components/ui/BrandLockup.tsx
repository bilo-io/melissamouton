import { useRef } from 'react';
import { cn } from '@/vendor/midnite-ui';
import { SITE_COPY } from '@/data/site';
import { useShimmer } from '@/hooks/use-shimmer';

interface BrandLockupProps {
  /** 'header' for the compact top bar lockup; 'showcase' for the brand page. */
  variant?: 'header' | 'showcase';
  className?: string;
}

/** Yin-yang MM icon paired with the melissamouton.co.za wordmark and occasional gradient shimmer. */
export function BrandLockup({ variant = 'header', className }: BrandLockupProps) {
  const shimmerRef = useRef<HTMLSpanElement>(null);
  const isShowcase = variant === 'showcase';
  useShimmer([shimmerRef], {
    first: isShowcase ? [600, 1200] : [2000, 3000],
    gap: isShowcase ? [4000, 7000] : [16000, 28000],
  });

  const iconSize = isShowcase ? 112 : 32;

  return (
    <span className={cn('inline-flex items-center', isShowcase ? 'flex-col gap-6 sm:flex-row sm:gap-7' : 'gap-2.5', className)}>
      <span
        className={cn(
          'relative shrink-0 transition-transform duration-300',
          isShowcase ? 'h-28 w-28 sm:h-32 sm:w-32' : 'h-8 w-8 group-hover:rotate-[-8deg] group-hover:scale-105',
        )}
      >
        <img src="/logos/app-logo-light.svg" alt="" width={iconSize} height={iconSize} className="h-full w-full dark:hidden" />
        <img src="/logos/app-logo-dark.svg" alt="" width={iconSize} height={iconSize} className="hidden h-full w-full dark:block" />
      </span>
      <span
        className={cn(
          'stack font-bold tracking-tight',
          isShowcase ? 'text-2xl sm:text-4xl' : 'hidden text-sm min-[480px]:inline-grid lg:text-base',
        )}
      >
        <span className="wordmark-stroke" aria-hidden>
          {SITE_COPY.wordmark}
        </span>
        <span>{SITE_COPY.wordmark}</span>
        <span ref={shimmerRef} className="shimmer shimmer-gradient" aria-hidden>
          {SITE_COPY.wordmark}
        </span>
      </span>
    </span>
  );
}
