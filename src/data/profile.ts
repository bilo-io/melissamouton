import photo from '@/assets/img/melissa.webp';

/** Everything here is from melissamouton.co.za. The DnB DJ half comes from the owner's brief, not the old site. */
export const profile = {
  name: 'Melissa Mouton',
  /** The old site's title is "Melissa Mouton Design". */
  siteName: 'Melissa Mouton Design',
  headline: 'Digital designer',
  email: 'hello@melissamouton.co.za',
  photo,
  photoAlt: 'Picture of Melissa Mouton',
  about: {
    title: "I'm a digital designer obsessed with clean layouts ⚡️, smart storytelling ✍️, and making things look good and work hard 🔍",
    subtitle:
      'I design across web, social, campaigns, and video — collaborating remotely with international teams to build cohesive, scalable brands 💻✨',
    contactLead: 'Say hi!',
  },
} as const;

/** The two halves of the hero split: what she is by trade, and what she is at heart. */
export const SIDES = {
  trade: {
    label: 'Design',
    tagline: 'By trade',
    /** From her about copy: where she designs. */
    lines: ['Web, social, campaigns, and video.'],
    chips: ['Web', 'Social', 'Campaigns', 'Video'],
  },
  heart: {
    label: 'DnB DJ',
    tagline: 'At heart',
    lines: [],
    chips: ['Drum & Bass'],
  },
} as const;

export const HERO = {
  trade: 'Design by trade.',
  heart: 'DnB DJ at heart.',
  sliderLabel: 'Design and DnB DJ split',
  sliderValue: (pct: number) => `Design ${pct}%, DnB DJ ${100 - pct}%`,
  scrollLabel: 'Scroll to About',
  cta: { projects: 'See the projects', contact: 'Say hi' },
} as const;
