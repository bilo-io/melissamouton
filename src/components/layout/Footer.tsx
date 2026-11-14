import { Link, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { SITE_COPY } from '@/data/site';
import { SECTION_ROUTES } from './sections';

function Column({ title, label, links }: { title: string; label: string; links: { to: string; label: string }[] }) {
  const { pathname } = useLocation();
  const onHome = pathname === '/' || SECTION_ROUTES.some((s) => pathname === `/${s.id}`);
  return (
    <nav aria-label={label}>
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            {/* On the home page a section link is a plain anchor, as in the top bar: the router would not scroll to it. */}
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
  const f = SITE_COPY.footer;
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <Column
            title="Projects"
            label={f.projectLinks}
            links={[{ to: '/projects', label: 'All projects' }, ...projects.map((p) => ({ to: `/projects/${p.id}`, label: p.name }))]}
          />
          <Column
            title={f.explore}
            label={f.siteLinks}
            links={[
              { to: '/', label: 'Home' },
              { to: '/#about', label: 'About' },
              { to: '/#experience', label: 'Experience' },
              { to: '/#contact', label: 'Contact' },
            ]}
          />
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Say hi</h2>
            <p className="mt-3 text-sm">
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground">
                <Mail className="h-4 w-4" aria-hidden /> {profile.email}
              </a>
            </p>
            <p className="mt-2 text-sm">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
              >
                {profile.linkedinLabel}
              </a>
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {f.rights}
          </p>
          <p>
            {f.builtWith}{' '}
            <a href={f.midniteUrl} target="_blank" rel="noreferrer" className="mui-rainbow-text font-semibold">
              {f.midnite}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
