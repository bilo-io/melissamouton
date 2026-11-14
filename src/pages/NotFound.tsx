import { Link } from 'react-router-dom';
import { buttonVariants, cn } from '@/vendor/midnite-ui';
import { SITE_COPY } from '@/data/site';

const COPY = SITE_COPY.notFound;

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[80svh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="hero-in font-mono text-sm text-muted-foreground">{COPY.code}</p>
      <h1 className="name-line mt-2 text-5xl font-extrabold tracking-tight sm:text-7xl">
        <span className="mui-rainbow-text">{COPY.heading}</span>
      </h1>
      <p className="hero-in mt-4 text-muted-foreground" style={{ '--i': 1 } as React.CSSProperties}>
        {COPY.line}
      </p>
      <Link to="/" className={cn(buttonVariants({ size: 'lg' }), 'hero-in mt-8 rounded-xl')} style={{ '--i': 2 } as React.CSSProperties}>
        {COPY.back}
      </Link>
    </main>
  );
}
