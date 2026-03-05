import { useCallback } from 'react';
import { useInterval } from '@/hooks/useInterval';
import { USAGE_STATS_STALE_TIME_MS, useUsageStatsStore } from '@/stores';

export const useProviderStats = () => {
  const keyStats = useUsageStatsStore((state) => state.keyStats);
  const usageDetails = useUsageStatsStore((state) => state.usageDetails);
  const isLoading = useUsageStatsStore((state) => state.loading);
  const loadUsageStats = useUsageStatsStore((state) => state.loadUsageStats);

  // Al entrar por primera vez a la página, se prioriza la reutilización del caché para evitar la extracción repetida de /usage entre páginas.
  const loadKeyStats = useCallback(async () => {
    await loadUsageStats({ staleTimeMs: USAGE_STATS_STALE_TIME_MS });
  }, [loadUsageStats]);

  // Forzar la actualización del usage compartido cuando se activa el temporizador.
  const refreshKeyStats = useCallback(async () => {
    await loadUsageStats({ force: true, staleTimeMs: USAGE_STATS_STALE_TIME_MS });
  }, [loadUsageStats]);

  useInterval(() => {
    void refreshKeyStats().catch(() => { });
  }, 240_000);

  return { keyStats, usageDetails, loadKeyStats, refreshKeyStats, isLoading };
};
