import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { projects } from '@/data/projects';
import { SITE_COPY } from '@/data/site';
import { PageShell } from '@/components/layout/PageShell';
import { RevealGroup, stagger } from '@/components/ui/Reveal';
import { ProjectCard } from '@/components/projects/ProjectCard';

/** Each project's search text, worked out once. Her projects have no categories, so there is a search box only. */
const INDEX = new Map(projects.map((p) => [p.id, [p.name, p.kind, p.description].join(' ').toLowerCase()] as const));

/** /projects: every project, with a search box whose text is kept in the URL (?q=). */
export default function ProjectsPage() {
  const c = SITE_COPY.projectsPage;
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';

  const setQ = (value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set('q', value);
        else next.delete('q');
        return next;
      },
      { replace: true },
    );

  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return projects.filter((p) => words.every((w) => INDEX.get(p.id)!.includes(w)));
  }, [q]);

  return (
    <PageShell eyebrow={c.eyebrow} title={c.title} back={{ to: '/', label: c.back }}>
      <RevealGroup className="space-y-4">
        <div className="reveal" style={stagger(0)}>
          <label className="surface flex items-center gap-3 px-4 py-3 focus-within:ring-2 focus-within:ring-ring">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="sr-only">{c.search}</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={c.placeholder}
              className="w-full min-w-0 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            {q ? (
              <button type="button" onClick={() => setQ('')} aria-label={c.clear} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
          </label>
        </div>
        <p className="reveal text-sm text-muted-foreground" style={stagger(1)} aria-live="polite" data-testid="project-count">
          {c.count(shown.length, projects.length)}
        </p>
      </RevealGroup>

      {shown.length ? (
        <RevealGroup className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <div key={p.id} className="reveal" style={stagger(i)}>
              <ProjectCard p={p} />
            </div>
          ))}
        </RevealGroup>
      ) : (
        <p className="mt-10 text-center text-muted-foreground">{c.empty}</p>
      )}
    </PageShell>
  );
}
