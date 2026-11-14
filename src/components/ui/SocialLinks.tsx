import type { SVGProps } from 'react';
import { GithubIcon, cn } from '@/vendor/midnite-ui';
import { socialIcons } from '@/data/cv-profile';
import hackerrankIcon from '@/assets/svg/hackerrank.svg';
import whatsappIcon from '@/assets/svg/whatsapp.svg';

type IconProps = SVGProps<SVGSVGElement>;

export const LinkedInIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const XIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const StackOverflowIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z" />
  </svg>
);

const HackerRankIcon = ({ className }: IconProps) => (
  <img src={hackerrankIcon} alt="" aria-hidden className={className} />
);

export const WhatsAppIcon = ({ className }: IconProps) => (
  <img src={whatsappIcon} alt="" aria-hidden className={className} />
);

const ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  linkedin: LinkedInIcon,
  github: (p) => <GithubIcon {...p} />,
  twitter: XIcon,
  whatsapp: WhatsAppIcon,
  hackerrank: HackerRankIcon,
  stackoverflow: StackOverflowIcon,
};

export function SocialLinks({
  codes,
  className,
  size = 'md',
}: {
  codes?: string[];
  className?: string;
  size?: 'sm' | 'md';
}) {
  const links = codes ? socialIcons.filter((s) => codes.includes(s.code)) : socialIcons;
  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {links.map((s) => {
        const Icon = ICONS[s.code];
        return (
          <li key={s.code}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              aria-label={s.name}
              title={s.name}
              className={cn(
                'lift flex items-center justify-center rounded-xl border border-border/70 bg-card/70 text-muted-foreground hover:text-foreground',
                size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
              )}
            >
              {Icon ? <Icon className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} /> : s.name.charAt(0)}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
