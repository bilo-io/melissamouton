import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/** The small gradient label above a page title. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="hero-in font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
      <span className="text-gradient font-semibold">{children}</span>
    </p>
  );
}

/** Frame for the secondary pages (projects). */
export function PageShell({
  title,
  eyebrow,
  back = { to: '/', label: 'Home' },
  header,
  children,
}: {
  title?: ReactNode;
  eyebrow?: string;
  back?: { to: string; label: string };
  /** Replaces the eyebrow and title with a page's own heading block (it must hold the h1). */
  header?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto min-h-[80svh] max-w-5xl px-4 pb-20 pt-28 sm:px-6">
      <Link to={back.to} className="hero-in chip mb-6 text-foreground">
        <ArrowLeft className="h-3 w-3" aria-hidden /> {back.label}
      </Link>
      {header ?? (
        <>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="name-line mt-2 text-4xl font-extrabold tracking-tight sm:text-6xl">{title}</h1>
        </>
      )}
      <div className="hero-in mt-10" style={{ '--i': 2 } as React.CSSProperties}>
        {children}
      </div>
    </main>
  );
}
