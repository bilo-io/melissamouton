import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { BackgroundPattern } from '@/vendor/midnite-ui';
import { readStored, writeStored } from '@/lib/storage';

export const BACKGROUND_STORAGE_KEY = 'bilo.background';

export type BackgroundChoice = BackgroundPattern;

/** Picker order: the starfield first, then every other Midnite pattern. */
export const BACKGROUND_OPTIONS: ReadonlyArray<{ value: BackgroundChoice; label: string }> = [
  { value: 'starfield', label: 'Starfield' },
  { value: 'aurora', label: 'Aurora' },
  { value: 'mesh-gradient', label: 'Mesh gradient' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'dots', label: 'Nebula dots' },
  { value: 'grid', label: 'Grid' },
  { value: 'plus-cross', label: 'Plus cross' },
  { value: 'blueprint', label: 'Blueprint' },
  { value: 'topographic', label: 'Topographic' },
  { value: 'waves', label: 'Waves' },
  { value: 'grain', label: 'Grain' },
  { value: 'none', label: 'None' },
];

const DEFAULT_BACKGROUND: BackgroundChoice = 'starfield';

function readInitial(): BackgroundChoice {
  const stored = readStored(BACKGROUND_STORAGE_KEY);
  return BACKGROUND_OPTIONS.some((o) => o.value === stored)
    ? (stored as BackgroundChoice)
    : DEFAULT_BACKGROUND;
}

type BackgroundContextValue = {
  background: BackgroundChoice;
  setBackground: (next: BackgroundChoice) => void;
};

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [background, setState] = useState<BackgroundChoice>(readInitial);
  const setBackground = useCallback((next: BackgroundChoice) => {
    setState(next);
    writeStored(BACKGROUND_STORAGE_KEY, next);
  }, []);
  const value = useMemo(() => ({ background, setBackground }), [background, setBackground]);
  return <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>;
}

export function useBackground(): BackgroundContextValue {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error('useBackground must be used within BackgroundProvider');
  return ctx;
}
