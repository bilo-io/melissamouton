import { useRef, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { projectById, projects, type IProject } from '@/data/projects';
import { SITE_COPY } from '@/data/site';
import { Eyebrow, PageShell } from '@/components/layout/PageShell';
import { TitleCarousel } from '@/components/ui/TitleCarousel';
import { CompareSlider } from '@/components/ui/CompareSlider';
import { RevealGroup, stagger } from '@/components/ui/Reveal';
import { useAmbientVideo } from '@/hooks/use-ambient-video';
import NotFound from '@/pages/NotFound';

const C = SITE_COPY.projectPage;

/** One section of the page: its heading and body cascade in when it scrolls into view. */
function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <RevealGroup as="section" className="mt-16" aria-labelledby={id}>
      <h2 id={id} className="reveal text-2xl font-bold tracking-tight sm:text-3xl" style={stagger(0)}>
        {title}
      </h2>
      <div className="reveal mt-6" style={stagger(1)}>
        {children}
      </div>
    </RevealGroup>
  );
}

/** The project's lead visual: its looping clip, else its first image. */
function Lead({ p }: { p: IProject }) {
  const ref = useRef<HTMLVideoElement>(null);
  useAmbientVideo(ref);
  if (p.video)
    return (
      <video
        ref={ref}
        className="block aspect-video w-full bg-muted object-cover"
        src={p.video.src}
        poster={p.video.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={p.video.alt}
      />
    );
  if (p.compare) return <CompareSlider {...p.compare} label={C.compareLabel} beforeLabel={C.before} afterLabel={C.after} />;
  const img = p.images[0];
  return img ? <img src={img.src} alt={img.alt} className="block w-full bg-muted object-contain" /> : null;
}

/** The rest of the images, after the lead one when it is one of them. */
function Gallery({ p }: { p: IProject }) {
  const leadIsImage = !p.video && !p.compare;
  const images = leadIsImage ? p.images.slice(1) : p.images;
  // The compare slider already shows the one ETHCC image.
  if (!images.length || p.compare) return null;
  return (
    <Section id="gallery" title={C.gallery}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {images.map((img) => (
          <li key={img.src} className="surface overflow-hidden">
            <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className="w-full bg-muted object-contain" />
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** /projects/:id: one project with its lead visual, story and images, and the title carousel to turn between projects. */
export default function ProjectPage() {
  const { id = '' } = useParams();
  const p = projectById(id.toLowerCase());
  if (!p) return <NotFound />;

  const at = projects.indexOf(p);
  // The ends stop, as the title carousel does.
  const prev = projects[at - 1] as IProject | undefined;
  const next = projects[at + 1] as IProject | undefined;
  const titles = projects.map((x) => ({ key: x.id, title: x.name, to: `/projects/${x.id}` }));

  return (
    <PageShell
      back={{ to: '/projects', label: C.back }}
      header={
        <TitleCarousel items={titles} index={at} noun={SITE_COPY.projects.noun} eyebrow={<Eyebrow key={p.id}>{C.eyebrow}</Eyebrow>}>
          <p key={p.id} className="hero-in mt-3 text-lg text-foreground/85" style={stagger(1)}>
            {p.kind}
          </p>
        </TitleCarousel>
      }
    >
      {/* Keyed so each project's media, sections and reveals start afresh. */}
      <div key={p.id}>
        <RevealGroup>
          <div className="reveal surface overflow-hidden" data-from="zoom" style={stagger(0)}>
            <Lead p={p} />
          </div>
        </RevealGroup>

        <Section id="about" title={C.about}>
          <p className="max-w-3xl text-lg text-muted-foreground">{p.description}</p>
        </Section>

        <Gallery p={p} />

        <RevealGroup as="nav" className="mt-20 grid gap-4 sm:grid-cols-2" aria-label={C.moreLabel}>
          {prev ? (
            <Link to={`/projects/${prev.id}`} className="reveal surface lift flex items-center gap-3 p-4" style={stagger(0)}>
              <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                <span className="block text-xs text-muted-foreground">{C.previous}</span>
                <span className="font-semibold">{prev.name}</span>
              </span>
            </Link>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}
          {next ? (
            <Link to={`/projects/${next.id}`} className="reveal surface lift flex items-center justify-end gap-3 p-4 text-right" style={stagger(1)}>
              <span>
                <span className="block text-xs text-muted-foreground">{C.next}</span>
                <span className="font-semibold">{next.name}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          ) : null}
        </RevealGroup>
      </div>
    </PageShell>
  );
}
