/** The copy, free of image imports so the e2e suite (which runs in Node) can read it. */
/** Everything here is from melissamouton.co.za. The DnB DJ half comes from the owner's brief, not the old site. */
export const profile = {
  name: 'Melissa Mouton',
  /** The old site's title is "Melissa Mouton Design". */
  siteName: 'Melissa Mouton Design',
  headline: '10+ yrs · UI/UX Design - Agentic Frontend Dev',
  location: 'Cape Town, South Africa',
  email: 'hello@melissamouton.co.za',
  linkedin: 'https://www.linkedin.com/in/melissamouton',
  linkedinLabel: 'LinkedIn',
  photoAlt: 'Picture of Melissa Mouton',
  about: {
    title:
      'UI/UX designer turned agentic frontend builder — shipping clean interfaces ⚡️, smart storytelling ✍️, and production code with AI workflows 🔍',
    subtitle:
      "With 10+ years of experience collaborating remotely with international teams across web, social, campaigns, and video, I've evolved my workflow as AI reshapes the job market — moving beyond static handoffs into agentic frontend development to take products from concept to shipped code 💻✨",
    contactLead: 'Say hi!',
  },
  skills: ['Digital Design', 'UI Design', 'UX Design', 'Agentic Frontend', 'Brand Systems', 'Campaigns'],
  languages: ['English (Full Professional)', 'Afrikaans (Full Professional)'],
} as const;

export interface RoleEntry {
  title: string;
  period: string;
  summary?: string;
}

export interface ExperienceEntry {
  organization: string;
  meta: string;
  roles: RoleEntry[];
}

export interface EducationEntry {
  institution: string;
  credential: string;
  period: string;
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    organization: 'Freelance',
    meta: 'Mar 2024 – Present · Cape Town, South Africa',
    roles: [
      {
        title: 'Freelance Graphic & UI/UX Designer',
        period: 'Mar 2024 – Present',
        summary: 'Brand-led digital campaigns, UI/UX systems, and AI-assisted frontend workflows for remote teams.',
      },
    ],
  },
  {
    organization: 'The Arcadia Group',
    meta: '6 yrs 3 mos · Remote',
    roles: [
      {
        title: 'Head of Brand Management, Relations & Outreach',
        period: 'Jan 2023 – Mar 2024',
      },
      {
        title: 'Lead UI/UX Designer',
        period: 'Sep 2021 – Mar 2023',
      },
      {
        title: 'Freelance Graphic & UI Designer',
        period: 'Jan 2018 – Mar 2023',
        summary: 'User interface design using Adobe XD for keychain wallets and ICO websites.',
      },
    ],
  },
  {
    organization: 'Self-employed · Odd Like Me Creative',
    meta: '5 yrs 1 mo · Cape Town, South Africa',
    roles: [
      {
        title: 'Graphic, UI, Crypto Designer & Social Media Coordinator',
        period: 'Jul 2019 – Nov 2021',
      },
      {
        title: 'Freelance Graphic / UI Designer',
        period: 'Oct 2017 – Nov 2021',
      },
      {
        title: 'Social Media Graphic Designer',
        period: 'Aug 2017 – Nov 2021',
      },
      {
        title: 'Owner & Graphic Designer',
        period: 'Nov 2016 – Nov 2021',
      },
    ],
  },
  {
    organization: 'Phangela Group',
    meta: 'Cape Town, South Africa',
    roles: [
      {
        title: 'Marketing Executive',
        period: 'Mar 2019 – Jul 2019',
      },
      {
        title: 'Freelance Graphic Designer / Events Project Manager / Social Media',
        period: 'Oct 2017 – Sep 2018',
      },
    ],
  },
  {
    organization: 'Pink Book',
    meta: 'Feb 2017 – Aug 2017 · Stellenberg, Cape Town',
    roles: [
      {
        title: 'Design & Social Media',
        period: 'Feb 2017 – Aug 2017',
        summary:
          'Design of the annual Pink Book publication, vlog production and editing, blog and social imagery, social media advertising, Google Analytics tracking, and SEO research.',
      },
    ],
  },
  {
    organization: 'eventcloud',
    meta: 'Sep 2016 – Nov 2016 · Cape Town, South Africa',
    roles: [
      {
        title: 'UI Artist',
        period: 'Sep 2016 – Nov 2016',
      },
    ],
  },
  {
    organization: 'Phangela Group & CDF',
    meta: 'Jan 2014 – Aug 2016 · Bellville, Cape Town',
    roles: [
      {
        title: 'Graphic Designer',
        period: 'Jan 2014 – Aug 2016',
        summary:
          'Marketing material designs including website and photography, events organization, uniforms, website maintenance, and social media management.',
      },
    ],
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    institution: 'Red & Yellow School',
    credential: 'Certificate, Digital Marketing',
    period: '2016',
  },
  {
    institution: "Pearson's Institute of Design",
    credential: 'Bachelor of Arts (BA), Graphic Design',
    period: 'Jan 2011 – Dec 2013',
  },
  {
    institution: 'Midrand Graduate Institute (MGI) CTI',
    credential: 'Bachelor of Arts (BA), Graphic Design – Advertising',
    period: '2011 – 2013',
  },
];

/** The two halves of the hero split: what she is by trade, and what she is at heart. */
export const SIDES = {
  trade: {
    label: 'Design',
    tagline: 'By trade',
    /** Where she designs and builds. */
    lines: ['UI/UX design, agentic frontend, campaigns, and video.'],
    chips: ['UI/UX', 'Agentic Dev', 'Campaigns', 'Video'],
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
