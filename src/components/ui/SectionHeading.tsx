import type { ReactNode } from 'react';
import { RevealGroup } from './Reveal';

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <RevealGroup className="mb-10 max-w-2xl sm:mb-14">
      <p className="reveal mb-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
        <span className="text-gradient font-semibold">{eyebrow}</span>
      </p>
      <h2
        className="reveal text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        style={{ '--i': 1 } as React.CSSProperties}
      >
        {title}
      </h2>
      {children ? (
        <p
          className="reveal mt-4 text-base text-muted-foreground sm:text-lg"
          style={{ '--i': 2 } as React.CSSProperties}
        >
          {children}
        </p>
      ) : null}
    </RevealGroup>
  );
}
