/**
 * API relacionada con estadísticas de uso
 */

import { apiClient } from './client';
import { computeKeyStats, KeyStats } from '@/utils/usage';

const USAGE_TIMEOUT_MS = 60 * 1000;

export interface UsageExportPayload {
  version?: number;
  exported_at?: string;
  usage?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface UsageImportResponse {
  added?: number;
  skipped?: number;
  total_requests?: number;
  failed_requests?: number;
  [key: string]: unknown;
}

export const usageApi = {
  /**
   * Obtener datos brutos de estadísticas de uso
   */
  getUsage: () => apiClient.get<Record<string, unknown>>('/usage', { timeout: USAGE_TIMEOUT_MS }),

  /**
   * Exportar instantánea de estadísticas de uso
   */
  exportUsage: () => apiClient.get<UsageExportPayload>('/usage/export', { timeout: USAGE_TIMEOUT_MS }),

  /**
   * Importar instantánea de estadísticas de uso
   */
  importUsage: (payload: unknown) =>
    apiClient.post<UsageImportResponse>('/usage/import', payload, { timeout: USAGE_TIMEOUT_MS }),

  /**
   * Calcular estadísticas de éxito/error de las claves, obteniendo los datos de uso primero si es necesario
   */
  async getKeyStats(usageData?: unknown): Promise<KeyStats> {
    let payload = usageData;
    if (!payload) {
      const response = await apiClient.get<Record<string, unknown>>('/usage', { timeout: USAGE_TIMEOUT_MS });
      payload = response?.usage ?? response;
    }
    return computeKeyStats(payload);
  }
};
