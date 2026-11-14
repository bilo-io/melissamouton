import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/vendor/midnite-ui';
import { BackgroundProvider } from '@/hooks/use-background';
import { BackgroundLayer } from '@/components/layout/BackgroundLayer';
import { TopBar } from '@/components/layout/TopBar';
import { SECTION_ROUTES } from '@/components/layout/sections';
import { Footer } from '@/components/layout/Footer';
import { PointerTrail } from '@/components/ui/PointerTrail';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import { metaFor } from '@/seo/meta';
import { applyMeta } from '@/seo/apply';

const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const ProjectPage = lazy(() => import('@/pages/ProjectPage'));

/** New route: start at the top, unless a section hash is the target. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/** Keeps the title, description, canonical URL, share card and JSON-LD in step with the route. */
function RouteMeta() {
  const { pathname } = useLocation();
  useEffect(() => applyMeta(metaFor(pathname)), [pathname]);
  return null;
}

/** Cursor spotlight for `.lift` cards (and anything `[data-spotlight]`): one delegated listener writing two CSS vars. */
function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    let last: PointerEvent | null = null;
    let frame = 0;
    const apply = () => {
      frame = 0;
      const e = last;
      const el = (e?.target as Element | null)?.closest?.('.lift, [data-spotlight]') as HTMLElement | null;
      if (!e || !el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
}

export default function Root() {
  useSpotlight();
  return (
    <ThemeProvider>
      <BackgroundProvider>
        <BrowserRouter>
          <ScrollToTop />
          <RouteMeta />
          <BackgroundLayer />
          <TopBar />
          <Suspense fallback={<div className="min-h-[80svh]" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              {SECTION_ROUTES.map((s) => (
                <Route key={s.id} path={`/${s.id}`} element={<Home section={s.id} />} />
              ))}
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
          <PointerTrail />
        </BrowserRouter>
      </BackgroundProvider>
    </ThemeProvider>
  );
}
