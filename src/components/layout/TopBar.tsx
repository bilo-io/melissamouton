import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sparkles, X } from 'lucide-react';
import { Button, Select, ThemeToggle, cn } from '@/vendor/midnite-ui';
import { BACKGROUND_OPTIONS, useBackground, type BackgroundChoice } from '@/hooks/use-background';
import { useShimmer } from '@/hooks/use-shimmer';
import { ScrollProgress } from './ScrollProgress';
import { SECTIONS, SECTION_ROUTES } from './sections';

/** Highlights the section currently under the top bar. */
function useActiveSection(enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return enabled ? active : null;
}

/** On the CV a native hash link scrolls; from other pages it routes home and Home scrolls. */
function SectionLink({
  id,
  onHome,
  ...rest
}: { id: string; onHome: boolean } & Omit<React.ComponentProps<'a'>, 'href'>) {
  return onHome ? <a href={`#${id}`} {...rest} /> : <Link to={`/#${id}`} {...rest} />;
}

export function TopBar() {
  const { pathname } = useLocation();
  const onHome = pathname === '/' || SECTION_ROUTES.some((s) => pathname === `/${s.id}`);
  const active = useActiveSection(onHome);
  const { background, setBackground } = useBackground();
  const [open, setOpen] = useState(false);
  // First sweep 2–3 s after load (inside the first 5 s), then one every 20–35 s.
  const shimmerRef = useRef<HTMLSpanElement>(null);
  useShimmer([shimmerRef], { first: [2000, 3000], gap: [20000, 35000] });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);


  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300',
        scrolled || open
          ? 'border-b border-border/60 bg-background/70 shadow-[0_8px_30px_-12px_hsl(var(--glow-2)/0.25)] backdrop-blur-md'
          : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link to="/" className="group mr-auto flex items-center gap-2 font-bold tracking-tight" aria-label="bilo.dev home">
          <span className="relative h-7 w-7 shrink-0 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
            <img src="/logos/app-logo-light.svg" alt="" width={28} height={28} className="h-7 w-7 dark:hidden" />
            <img src="/logos/app-logo-dark.svg" alt="" width={28} height={28} className="hidden h-7 w-7 dark:block" />
          </span>
          <span className="stack hidden text-lg min-[400px]:inline-grid">
            <span className="wordmark-stroke" aria-hidden>
              bilo.dev
            </span>
            <span>bilo.dev</span>
            <span ref={shimmerRef} className="shimmer" aria-hidden>
              bilo.dev
            </span>
          </span>
        </Link>

        <nav aria-label="Sections" className="hidden items-center lg:flex">
          {SECTIONS.map((s) => (
            <SectionLink key={s.id} id={s.id} onHome={onHome} className="nav-link" aria-current={active === s.id ? 'true' : undefined}>
              {s.label}
            </SectionLink>
          ))}
          <Link to="/games" className="nav-link" aria-current={pathname.startsWith('/games') ? 'true' : undefined}>
            Games
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Select<BackgroundChoice>
            aria-label="Background effect"
            className="w-[8.5rem] sm:w-40"
            options={BACKGROUND_OPTIONS.map((o) => ({
              ...o,
              icon: o.value === 'starfield' ? <Sparkles className="h-3.5 w-3.5 text-muted-foreground" /> : undefined,
            }))}
            value={background}
            onChange={setBackground}
          />
          <div className="topbar-theme">
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav aria-label="Sections" className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 pb-4 sm:grid-cols-4 lg:hidden">
          {SECTIONS.map((s, i) => (
            <SectionLink
              key={s.id}
              id={s.id}
              onHome={onHome}
              onClick={() => setOpen(false)}
              className="hero-in rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              style={{ '--i': i - 5 } as React.CSSProperties}
            >
              {s.label}
            </SectionLink>
          ))}
          <Link
            to="/games"
            className="hero-in rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            style={{ '--i': 1 } as React.CSSProperties}
          >
            Games
          </Link>
        </nav>
      ) : null}

      <ScrollProgress />
    </header>
  );
}
