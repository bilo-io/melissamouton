import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { IProject } from '@/data/projects';
import { SITE_COPY } from '@/data/site';
import { GlassCarousel, type CardSlot } from '@/components/ui/GlassCarousel';
import { ProjectCover } from './ProjectCard';

/** How long each project stays in the middle before the ring turns on. */
const INTERVAL = 4500;

/** One featured card: a still, the name, what kind of project it is and the way in. */
function Card({ p, slot }: { p: IProject; slot: CardSlot }) {
  return (
    <Link to={`/projects/${p.id}`} {...slot.cardProps}>
      <div className="relative z-[1] flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border/60 bg-muted/20">
          <ProjectCover p={p} />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-xl font-semibold">{p.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{p.kind}</p>
          <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-foreground">
            {SITE_COPY.projects.view} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** The home page's featured projects: a glass ring with cards stacked at either side, turning on its own. */
export function ProjectCarousel({ items }: { items: IProject[] }) {
  const c = SITE_COPY.projects;
  return (
    <GlassCarousel
      items={items}
      keyOf={(p) => p.id}
      titleOf={(p) => p.name}
      label={c.featuredLabel}
      noun={c.noun}
      reach={Math.min(3, Math.floor((items.length - 1) / 2))}
      interval={INTERVAL}
      renderCard={(p, _i, slot) => <Card p={p} slot={slot} />}
    />
  );
}
