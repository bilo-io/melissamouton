import sooki1 from '@/assets/projects/sooki/sooki-1.webp';
import sooki2 from '@/assets/projects/sooki/sooki-2.webp';
import sooki3 from '@/assets/projects/sooki/sooki-3.webp';
import sooki4 from '@/assets/projects/sooki/sooki-4.webp';
import sooki5 from '@/assets/projects/sooki/sooki-5.webp';
import propscan1 from '@/assets/projects/propscan/propscan-1.svg';
import propscan2 from '@/assets/projects/propscan/propscan-2.svg';
import propscan3 from '@/assets/projects/propscan/propscan-3.svg';
import propscan4 from '@/assets/projects/propscan/propscan-4.svg';
import propscan5 from '@/assets/projects/propscan/propscan-5.svg';
import propscan6 from '@/assets/projects/propscan/propscan-6.svg';
import propscan7 from '@/assets/projects/propscan/propscan-7.svg';
import arcadia1 from '@/assets/projects/arcadia/arcadia-1.webp';
import arcadia2 from '@/assets/projects/arcadia/arcadia-2.webp';
import arcadia3 from '@/assets/projects/arcadia/arcadia-3.webp';
import arcadia4 from '@/assets/projects/arcadia/arcadia-4.webp';
import arcadia5 from '@/assets/projects/arcadia/arcadia-5.webp';
import arcadia6 from '@/assets/projects/arcadia/arcadia-6.webp';
import ethccInstallation from '@/assets/projects/ethcc/ethcc-installation.webp';
import ethccBefore from '@/assets/projects/ethcc/ethcc-before.webp';

import { projectCopy } from './project-copy';

export interface IImage {
  src: string;
  alt: string;
}

export interface IProject {
  id: string;
  name: string;
  /** The old site's subtitle: what kind of project it is. */
  kind: string;
  description: string;
  images: IImage[];
  /** A looping clip (Payfluent's deck), served from public/. */
  video?: { src: string; poster: string; alt: string };
  /** A before and after, dragged with a slider (ETHCC's windows). */
  compare?: { before: IImage; after: IImage };
}

const shots = (name: string, srcs: string[]): IImage[] => srcs.map((src, i) => ({ src, alt: `${name}, image ${i + 1}` }));

type Media = Pick<IProject, 'images' | 'video' | 'compare'>;

/** Each project's images, by id. */
const MEDIA: Record<(typeof projectCopy)[number]['id'], Media> = {
  propscan: { images: shots('PropScan', [propscan1, propscan2, propscan3, propscan4, propscan5, propscan6, propscan7]) },
  arcadia: { images: shots('Arcadia', [arcadia1, arcadia2, arcadia3, arcadia4, arcadia5, arcadia6]) },
  ethcc: {
    images: [{ src: ethccInstallation, alt: 'ETHCC window installation' }],
    compare: {
      before: { src: ethccBefore, alt: 'ETHCC windows before the installation' },
      after: { src: ethccInstallation, alt: 'ETHCC windows with the installation' },
    },
  },
  payfluent: {
    images: [],
    video: { src: '/videos/payfluent-deck.mp4', poster: '/videos/payfluent-deck.jpg', alt: 'Payfluent pitch deck, a looping preview' },
  },
  sooki: { images: shots('Sooki', [sooki1, sooki2, sooki3, sooki4, sooki5]) },
};

export const projects: IProject[] = projectCopy.map((c) => ({ ...c, ...MEDIA[c.id] }));

export const projectById = (id: string) => projects.find((p) => p.id === id);

/** The still a card shows: the first screenshot, else the video's poster. */
export const coverOf = (p: IProject): IImage | undefined =>
  p.images[0] ?? (p.video ? { src: p.video.poster, alt: p.video.alt } : undefined);
