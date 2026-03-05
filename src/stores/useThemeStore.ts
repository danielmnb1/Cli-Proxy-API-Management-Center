/**
 * Gestión del estado del tema
 * Migrado desde src/modules/theme.js del proyecto original
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';
import { STORAGE_KEY_THEME } from '@/utils/constants';

type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
  initializeTheme: () => () => void;
}

const getSystemTheme = (): ResolvedTheme => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const applyTheme = (resolved: ResolvedTheme) => {
  if (resolved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'auto',
      resolvedTheme: 'light',

      setTheme: (theme) => {
        const resolved: ResolvedTheme = theme === 'auto' ? getSystemTheme() : theme;
        applyTheme(resolved);
        set({ theme, resolvedTheme: resolved });
      },

      cycleTheme: () => {
        const { theme, setTheme } = get();
        const order: Theme[] = ['light', 'dark', 'auto'];
        const currentIndex = order.indexOf(theme);
        const nextTheme = order[(currentIndex + 1) % order.length];
        setTheme(nextTheme);
      },

      initializeTheme: () => {
        const { theme, setTheme } = get();

        // Aplicar el tema guardado
        setTheme(theme);

        // Escuchar cambios en el tema del sistema (solo efectivo en modo auto)
        if (!window.matchMedia) {
          return () => { };
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = () => {
          const { theme: currentTheme } = get();
          if (currentTheme === 'auto') {
            const resolved = getSystemTheme();
            applyTheme(resolved);
            set({ resolvedTheme: resolved });
          }
        };

        mediaQuery.addEventListener('change', listener);

        return () => mediaQuery.removeEventListener('change', listener);
      },
    }),
    {
      name: STORAGE_KEY_THEME,
    }
  )
);
