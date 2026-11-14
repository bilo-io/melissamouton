import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { coverOf, type IProject } from '@/data/projects';
import { SITE_COPY } from '@/data/site';

/** A project's cover: its first image (or the video's poster), with a play mark for the video. */
export function ProjectCover({ p, className = '' }: { p: IProject; className?: string }) {
  const cover = coverOf(p);
  if (!cover) return null;
  return (
    <>
      <img
        src={cover.src}
        alt=""
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105 ${className}`}
      />
      {p.video ? (
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur">
            <Play className="ml-0.5 h-5 w-5" />
          </span>
        </span>
      ) : null}
    </>
  );
}

/** One card of the /projects grid. */
export function ProjectCard({ p }: { p: IProject }) {
  return (
    <article className="surface lift group flex h-full flex-col overflow-hidden">
      <Link to={`/projects/${p.id}`} className="flex h-full flex-col" aria-label={`${p.name}, ${p.kind}`}>
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border/60 bg-muted/20">
          <ProjectCover p={p} />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold">{p.name}</h3>
          <p className="mt-1 text-sm text-foreground/85">{p.kind}</p>
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{p.description}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
            {SITE_COPY.projects.view} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}
