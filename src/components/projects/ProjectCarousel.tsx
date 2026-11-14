import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { IProject } from '@/data/cv-projects';
import { projectStack } from '@/data/project-stack';
import { GlassCarousel, type CardSlot } from '@/components/ui/GlassCarousel';
import { ArtBadges, ArtPlaceholder, CompanyLogo } from './ProjectCard';

/** How long each project stays in the middle before the ring turns on. */
const INTERVAL = 4500;

/** One featured card. Its art is a single still, not ProjectArt: that one's screenshot buttons cannot sit inside the card's link. */
function Card({ p, slot }: { p: IProject; slot: CardSlot }) {
  const art = p.images?.[0]?.src ?? p.thumbnail;
  const tech = projectStack(p).slice(0, 4);
  return (
    <Link to={`/projects/${p.id}`} {...slot.cardProps}>
      <div className="relative z-[1] flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border/60 bg-muted/20">
          {art ? (
            <img
              src={art}
              alt=""
              loading="lazy"
              decoding="async"
              className={p.portrait ? 'h-full w-full object-contain py-2' : 'h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105'}
            />
          ) : (
            <ArtPlaceholder p={p} />
          )}
          <ArtBadges p={p} />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-xl font-semibold">{p.name}</h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {p.company ? <CompanyLogo company={p.company} /> : null}
            {p.shortDescription}
          </p>
          {tech.length ? (
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${p.name} stack`}>
              {tech.map((t) => (
                <li key={t.key} className="chip py-0 text-xs">
                  {t.label}
                </li>
              ))}
            </ul>
          ) : null}
          <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-foreground">
            View project <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** The landing page's featured projects: a glass ring with three cards stacked at either side, turning on its own. */
export function ProjectCarousel({ items }: { items: IProject[] }) {
  return (
    <GlassCarousel
      items={items}
      keyOf={(p) => p.id}
      titleOf={(p) => p.name}
      label="Featured projects"
      noun="project"
      reach={3}
      interval={INTERVAL}
      renderCard={(p, _i, slot) => <Card p={p} slot={slot} />}
    />
  );
}
