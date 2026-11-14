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

/** Copy and images carried over from melissamouton.co.za. The order is the old site's list, top to bottom. */
export const projects: IProject[] = [
  {
    id: 'propscan',
    name: 'PropScan',
    kind: 'Digital Product & UX Design',
    description:
      'A digital property platform designed to simplify browsing, comparison, and decision-making for buyers and renters. I led the visual UI design and layout system, focusing on clarity, hierarchy, and usability across key screens. The result was a clean, scalable interface that balances product functionality with strong visual structure.',
    images: shots('PropScan', [propscan1, propscan2, propscan3, propscan4, propscan5, propscan6, propscan7]),
  },
  {
    id: 'arcadia',
    name: 'Arcadia',
    kind: 'Digital Campaigns & Social Content System',
    description:
      'Ongoing design of digital-first campaign and social assets for an international tech brand, spanning organic content, article headers, and promotional visuals. I created flexible templates and visual systems to maintain consistency while moving quickly across multiple channels. Work was delivered remotely in close collaboration with marketing and leadership teams.',
    images: shots('Arcadia', [arcadia1, arcadia2, arcadia3, arcadia4, arcadia5, arcadia6]),
  },
  {
    id: 'ethcc',
    name: 'ETHCC',
    kind: 'Large-Scale Brand Activation',
    description:
      'Concept and design of a cyber jungle-inspired window installation for an international technology conference in France. Working closely with the client and event marketing team, I translated the brand concept across four full-height windows while integrating multiple partner logos seamlessly. The activation created a bold, cohesive visual presence within a high-traffic event environment.',
    images: [{ src: ethccInstallation, alt: 'ETHCC window installation' }],
    compare: {
      before: { src: ethccBefore, alt: 'ETHCC windows before the installation' },
      after: { src: ethccInstallation, alt: 'ETHCC windows with the installation' },
    },
  },
  {
    id: 'payfluent',
    name: 'Payfluent',
    kind: 'Brand Storytelling Pitch Deck',
    description:
      "Design of a visually driven pitch deck to communicate Payfluent's product offering and value proposition to partners and investors. The focus was on clear narrative flow, strong typography, and layout consistency to support storytelling at pace. Designed for clarity, impact, and reuse across multiple presentations.",
    images: [],
    video: { src: '/videos/payfluent-deck.mp4', poster: '/videos/payfluent-deck.jpg', alt: 'Payfluent pitch deck, a looping preview' },
  },
  {
    id: 'sooki',
    name: 'Sooki',
    kind: 'UI System & Interface Exploration',
    description:
      'A UI-focused design project exploring layout, component systems, and interface clarity for a digital wallet product. I developed a cohesive visual language and reusable UI elements to support scalability and future feature growth. The project highlights structured thinking around digital systems and user-focused design.',
    images: shots('Sooki', [sooki1, sooki2, sooki3, sooki4, sooki5]),
  },
];

/** The projects the home page's carousel features, by id. */
export const FEATURED_IDS = projects.map((p) => p.id);

export const projectById = (id: string) => projects.find((p) => p.id === id);

/** The still a card shows: the first screenshot, else the video's poster. */
export const coverOf = (p: IProject): IImage | undefined =>
  p.images[0] ?? (p.video ? { src: p.video.poster, alt: p.video.alt } : undefined);
