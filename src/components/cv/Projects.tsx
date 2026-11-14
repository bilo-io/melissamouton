import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { SITE_COPY } from '@/data/site';
import { RevealGroup } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCarousel } from '@/components/projects/ProjectCarousel';

/** The home page's projects: the featured few in a turning carousel, and the way to the rest. */
export function Projects() {
  const c = SITE_COPY.projects;
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading eyebrow={c.eyebrow} title={<>{c.title[0]} <span className="text-gradient">{c.title[1]}</span></>} />

      <ProjectCarousel items={projects} />

      <RevealGroup className="mt-10 flex justify-center">
        <Link to="/projects" className="reveal btn-glow">
          {c.explore} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </RevealGroup>
    </section>
  );
}
