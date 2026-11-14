import { Link, useLocation } from 'react-router-dom';
import { SECTION_ROUTES } from './sections';
import { profile } from '@/data/cv-profile';
import { workflows } from '@/data/agentic-workflows';
import { usedCategories } from '@/data/cv-projects';

const readyWorkflows = workflows.filter((w) => w.status === 'ready');

function Column({ title, label, links }: { title: string; label: string; links: { to: string; label: string }[] }) {
  const { pathname } = useLocation();
  const onHome = pathname === '/' || SECTION_ROUTES.some((s) => pathname === `/${s.id}`);
  return (
    <nav aria-label={label}>
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            {/* On the CV a section link is a plain anchor, as in the top bar: the router would not scroll to it. */}
            {onHome && l.to.startsWith('/#') ? (
              <a href={l.to.slice(1)} className="text-foreground/80 transition-colors hover:text-foreground">
                {l.label}
              </a>
            ) : (
              <Link to={l.to} className="text-foreground/80 transition-colors hover:text-foreground">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <Column
            title="Projects"
            label="Project links"
            links={[{ to: '/projects', label: 'All projects' }, ...usedCategories.map((c) => ({ to: `/projects?category=${c.code}`, label: c.name }))]}
          />
          <Column
            title="Workflows"
            label="Workflow links"
            links={readyWorkflows.map((w) => ({ to: `/agentic-workflows/${w.slug}`, label: w.title }))}
          />
          <Column
            title="Explore"
            label="Site links"
            links={[
              { to: '/', label: 'CV' },
              { to: '/games', label: 'Games' },
              { to: '/#contact', label: 'Contact' },
            ]}
          />
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p>
            Built with{' '}
            <a
              href="https://github.com/bilo-io/midnite-ui"
              target="_blank"
              rel="noreferrer"
              className="mui-rainbow-text font-semibold"
            >
              Midnite UI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
