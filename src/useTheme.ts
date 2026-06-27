import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
const STORAGE_KEY = 'simul8-theme';

function getInitialTheme(): Theme {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
  }
  return 'dark';
}

/** Theme state synced to <html data-theme>, persisted in localStorage. Dark by default. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode / storage disabled — ignore */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#15141a' : '#f6f4ee');
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  return { theme, toggle };
}
