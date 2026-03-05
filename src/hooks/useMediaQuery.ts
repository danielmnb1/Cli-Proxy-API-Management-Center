/**
 * Hook de Media Query
 */

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Establecer el valor inicial a través del listener para evitar setState directo en el effect
    listener({ matches: media.matches } as MediaQueryListEvent);

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
