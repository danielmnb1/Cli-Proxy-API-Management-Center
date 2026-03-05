/**
 * API relacionada con la configuración
 */

import { apiClient } from './client';
import type { Config } from '@/types';
import { normalizeConfigResponse } from './transformers';

export const configApi = {
  /**
   * Obtener configuración (con normalización de campos)
   */
  async getConfig(): Promise<Config> {
    const raw = await apiClient.get('/config');
    return normalizeConfigResponse(raw);
  },

  /**
   * Obtener configuración cruda (sin transformación)
   */
  getRawConfig: () => apiClient.get('/config'),

  /**
   * Actualizar modo Debug
   */
  updateDebug: (enabled: boolean) => apiClient.put('/debug', { value: enabled }),

  /**
   * Actualizar URL del proxy
   */
  updateProxyUrl: (proxyUrl: string) => apiClient.put('/proxy-url', { value: proxyUrl }),

  /**
   * Limpiar URL del proxy
   */
  clearProxyUrl: () => apiClient.delete('/proxy-url'),

  /**
   * Actualizar número de reintentos
   */
  updateRequestRetry: (retryCount: number) => apiClient.put('/request-retry', { value: retryCount }),

  /**
   * Cuota excedida: Cambiar de proyecto
   */
  updateSwitchProject: (enabled: boolean) =>
    apiClient.put('/quota-exceeded/switch-project', { value: enabled }),

  /**
   * Cuota excedida: Cambiar a modelo de vista previa (preview model)
   */
  updateSwitchPreviewModel: (enabled: boolean) =>
    apiClient.put('/quota-exceeded/switch-preview-model', { value: enabled }),

  /**
   * Interruptor de estadísticas de uso
   */
  updateUsageStatistics: (enabled: boolean) =>
    apiClient.put('/usage-statistics-enabled', { value: enabled }),

  /**
   * Interruptor de registro de solicitudes (Request Log)
   */
  updateRequestLog: (enabled: boolean) => apiClient.put('/request-log', { value: enabled }),

  /**
   * Interruptor para guardar registros en archivo
   */
  updateLoggingToFile: (enabled: boolean) => apiClient.put('/logging-to-file', { value: enabled }),

  /**
   * Obtener el límite máximo del tamaño total de registros (MB)
   */
  async getLogsMaxTotalSizeMb(): Promise<number> {
    const data = await apiClient.get<Record<string, unknown>>('/logs-max-total-size-mb');
    const value = data?.['logs-max-total-size-mb'] ?? data?.logsMaxTotalSizeMb ?? 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  },

  /**
   * Actualizar el límite máximo del tamaño total de registros (MB)
   */
  updateLogsMaxTotalSizeMb: (value: number) =>
    apiClient.put('/logs-max-total-size-mb', { value }),

  /**
   * Interruptor de autenticación WebSocket
   */
  updateWsAuth: (enabled: boolean) => apiClient.put('/ws-auth', { value: enabled }),

  /**
   * Obtener interruptor de prefijo de modelo forzado
   */
  async getForceModelPrefix(): Promise<boolean> {
    const data = await apiClient.get<Record<string, unknown>>('/force-model-prefix');
    return Boolean(data?.['force-model-prefix'] ?? data?.forceModelPrefix ?? false);
  },

  /**
   * Actualizar interruptor de prefijo de modelo forzado
   */
  updateForceModelPrefix: (enabled: boolean) => apiClient.put('/force-model-prefix', { value: enabled }),

  /**
   * Obtener estrategia de enrutamiento
   */
  async getRoutingStrategy(): Promise<string> {
    const data = await apiClient.get<Record<string, unknown>>('/routing/strategy');
    const strategy = data?.strategy ?? data?.['routing-strategy'] ?? data?.routingStrategy;
    return typeof strategy === 'string' ? strategy : 'round-robin';
  },

  /**
   * Actualizar estrategia de enrutamiento
   */
  updateRoutingStrategy: (strategy: string) => apiClient.put('/routing/strategy', { value: strategy }),
};
