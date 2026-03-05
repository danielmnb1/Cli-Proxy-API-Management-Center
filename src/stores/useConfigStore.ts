/**
 * Gestión del estado de configuración
 * Migrado desde src/core/config-service.js del proyecto original
 */

import { create } from 'zustand';
import type { Config } from '@/types';
import type { RawConfigSection } from '@/types/config';
import { configApi } from '@/services/api/config';
import { CACHE_EXPIRY_MS } from '@/utils/constants';

interface ConfigCache {
  data: unknown;
  timestamp: number;
}

interface ConfigState {
  config: Config | null;
  cache: Map<string, ConfigCache>;
  loading: boolean;
  error: string | null;

  // Operaciones
  fetchConfig: {
    (section?: undefined, forceRefresh?: boolean): Promise<Config>;
    (section: RawConfigSection, forceRefresh?: boolean): Promise<unknown>;
  };
  updateConfigValue: (section: RawConfigSection, value: unknown) => void;
  clearCache: (section?: RawConfigSection) => void;
  isCacheValid: (section?: RawConfigSection) => boolean;
}

let configRequestToken = 0;
let inFlightConfigRequest: { id: number; promise: Promise<Config> } | null = null;

const SECTION_KEYS: RawConfigSection[] = [
  'debug',
  'proxy-url',
  'request-retry',
  'quota-exceeded',
  'usage-statistics-enabled',
  'request-log',
  'logging-to-file',
  'logs-max-total-size-mb',
  'ws-auth',
  'force-model-prefix',
  'routing/strategy',
  'api-keys',
  'ampcode',
  'gemini-api-key',
  'codex-api-key',
  'claude-api-key',
  'vertex-api-key',
  'openai-compatibility',
  'oauth-excluded-models'
];

const extractSectionValue = (config: Config | null, section?: RawConfigSection) => {
  if (!config) return undefined;
  switch (section) {
    case 'debug':
      return config.debug;
    case 'proxy-url':
      return config.proxyUrl;
    case 'request-retry':
      return config.requestRetry;
    case 'quota-exceeded':
      return config.quotaExceeded;
    case 'usage-statistics-enabled':
      return config.usageStatisticsEnabled;
    case 'request-log':
      return config.requestLog;
    case 'logging-to-file':
      return config.loggingToFile;
    case 'logs-max-total-size-mb':
      return config.logsMaxTotalSizeMb;
    case 'ws-auth':
      return config.wsAuth;
    case 'force-model-prefix':
      return config.forceModelPrefix;
    case 'routing/strategy':
      return config.routingStrategy;
    case 'api-keys':
      return config.apiKeys;
    case 'ampcode':
      return config.ampcode;
    case 'gemini-api-key':
      return config.geminiApiKeys;
    case 'codex-api-key':
      return config.codexApiKeys;
    case 'claude-api-key':
      return config.claudeApiKeys;
    case 'vertex-api-key':
      return config.vertexApiKeys;
    case 'openai-compatibility':
      return config.openaiCompatibility;
    case 'oauth-excluded-models':
      return config.oauthExcludedModels;
    default:
      if (!section) return undefined;
      return config.raw?.[section];
  }
};

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: null,
  cache: new Map(),
  loading: false,
  error: null,

  fetchConfig: (async (section?: RawConfigSection, forceRefresh: boolean = false) => {
    const { cache, isCacheValid } = get();

    // Verificar caché
    const cacheKey = section || '__full__';
    if (!forceRefresh && isCacheValid(section)) {
      const cached = cache.get(cacheKey);
      if (cached) {
        return cached.data;
      }
    }

    // Si falla el caché de la sección pero el caché completo está disponible, reutilizar la configuración obtenida para evitar peticiones /config repetidas
    if (!forceRefresh && section && isCacheValid()) {
      const fullCached = cache.get('__full__');
      if (fullCached?.data) {
        return extractSectionValue(fullCached.data as Config, section);
      }
    }

    // Fusionar múltiples peticiones /config al mismo tiempo (ej: StrictMode o múltiples páginas disparadas simultáneamente)
    if (inFlightConfigRequest) {
      const data = await inFlightConfigRequest.promise;
      return section ? extractSectionValue(data, section) : data;
    }

    // Obtener datos nuevos
    set({ loading: true, error: null });

    const requestId = (configRequestToken += 1);
    try {
      const requestPromise = configApi.getConfig();
      inFlightConfigRequest = { id: requestId, promise: requestPromise };
      const data = await requestPromise;
      const now = Date.now();

      // Si la conexión se cambió o se cerró sesión durante la petición, ignorar el resultado de la petición antigua para evitar sobrescribir el estado de la nueva sesión
      if (requestId !== configRequestToken) {
        return section ? extractSectionValue(data, section) : data;
      }

      // Actualizar caché
      const newCache = new Map(cache);
      newCache.set('__full__', { data, timestamp: now });
      SECTION_KEYS.forEach((key) => {
        const value = extractSectionValue(data, key);
        if (value !== undefined) {
          newCache.set(key, { data: value, timestamp: now });
        }
      });

      set({
        config: data,
        cache: newCache,
        loading: false
      });

      return section ? extractSectionValue(data, section) : data;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : typeof error === 'string' ? error : 'Fallo al obtener la configuración';
      if (requestId === configRequestToken) {
        set({
          error: message || 'Fallo al obtener la configuración',
          loading: false
        });
      }
      throw error;
    } finally {
      if (inFlightConfigRequest?.id === requestId) {
        inFlightConfigRequest = null;
      }
    }
  }) as ConfigState['fetchConfig'],

  updateConfigValue: (section, value) => {
    set((state) => {
      const raw = { ...(state.config?.raw || {}) };
      raw[section] = value;
      const nextConfig: Config = { ...(state.config || {}), raw };

      switch (section) {
        case 'debug':
          nextConfig.debug = value as Config['debug'];
          break;
        case 'proxy-url':
          nextConfig.proxyUrl = value as Config['proxyUrl'];
          break;
        case 'request-retry':
          nextConfig.requestRetry = value as Config['requestRetry'];
          break;
        case 'quota-exceeded':
          nextConfig.quotaExceeded = value as Config['quotaExceeded'];
          break;
        case 'usage-statistics-enabled':
          nextConfig.usageStatisticsEnabled = value as Config['usageStatisticsEnabled'];
          break;
        case 'request-log':
          nextConfig.requestLog = value as Config['requestLog'];
          break;
        case 'logging-to-file':
          nextConfig.loggingToFile = value as Config['loggingToFile'];
          break;
        case 'logs-max-total-size-mb':
          nextConfig.logsMaxTotalSizeMb = value as Config['logsMaxTotalSizeMb'];
          break;
        case 'ws-auth':
          nextConfig.wsAuth = value as Config['wsAuth'];
          break;
        case 'force-model-prefix':
          nextConfig.forceModelPrefix = value as Config['forceModelPrefix'];
          break;
        case 'routing/strategy':
          nextConfig.routingStrategy = value as Config['routingStrategy'];
          break;
        case 'api-keys':
          nextConfig.apiKeys = value as Config['apiKeys'];
          break;
        case 'ampcode':
          nextConfig.ampcode = value as Config['ampcode'];
          break;
        case 'gemini-api-key':
          nextConfig.geminiApiKeys = value as Config['geminiApiKeys'];
          break;
        case 'codex-api-key':
          nextConfig.codexApiKeys = value as Config['codexApiKeys'];
          break;
        case 'claude-api-key':
          nextConfig.claudeApiKeys = value as Config['claudeApiKeys'];
          break;
        case 'vertex-api-key':
          nextConfig.vertexApiKeys = value as Config['vertexApiKeys'];
          break;
        case 'openai-compatibility':
          nextConfig.openaiCompatibility = value as Config['openaiCompatibility'];
          break;
        case 'oauth-excluded-models':
          nextConfig.oauthExcludedModels = value as Config['oauthExcludedModels'];
          break;
        default:
          break;
      }

      return { config: nextConfig };
    });

    // Limpiar el caché de esta sección
    get().clearCache(section);
  },

  clearCache: (section) => {
    const { cache } = get();
    const newCache = new Map(cache);

    if (section) {
      newCache.delete(section);
      // También borra la caché de configuración completa
      newCache.delete('__full__');

      set({ cache: newCache });
      return;
    } else {
      newCache.clear();
    }

    // Limpiar todo el caché generalmente representa "cambiar conexión/cerrar sesión/refresco total", requiere invalidar peticiones antiguas en vuelo
    configRequestToken += 1;
    inFlightConfigRequest = null;

    set({ config: null, cache: newCache, loading: false, error: null });
  },

  isCacheValid: (section) => {
    const { cache } = get();
    const cacheKey = section || '__full__';
    const cached = cache.get(cacheKey);

    if (!cached) return false;

    return Date.now() - cached.timestamp < CACHE_EXPIRY_MS;
  }
}));
