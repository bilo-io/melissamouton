import { SITE_COPY } from '@/data/site';
import { BrandLockup } from '@/components/ui/BrandLockup';

/** Minimal brand page showing only the yin-yang MM icon and melissamouton.co.za wordmark. */
export default function BrandPage() {
  return (
    <main className="flex min-h-[calc(100svh-8rem)] items-center justify-center px-4 py-24 sm:px-6">
      <h1 className="sr-only">{SITE_COPY.brandPage.title}</h1>
      <BrandLockup variant="showcase" />
    </main>
  );
}
