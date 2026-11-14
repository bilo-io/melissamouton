import { useEffect } from 'react';
import { Hero } from '@/components/cv/Hero';
import { About } from '@/components/cv/About';
import { Projects } from '@/components/cv/Projects';
import { Contact } from '@/components/cv/Contact';

/** The home page. `section` supports the /<id> routes (/about, /contact), which land on that section. */
export default function Home({ section }: { section?: string }) {
  useEffect(() => {
    const id = section ?? window.location.hash.slice(1);
    if (!id) return;
    // Wait a frame so the section exists and layout has settled.
    const raf = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(raf);
  }, [section]);

  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  );
}
