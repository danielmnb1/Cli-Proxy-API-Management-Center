/**
 * Cliente API Axios
 * Sustituye al archivo original src/core/api-client.js
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiClientConfig, ApiError } from '@/types';
import {
  BUILD_DATE_HEADER_KEYS,
  REQUEST_TIMEOUT_MS,
  VERSION_HEADER_KEYS
} from '@/utils/constants';
import { computeApiUrl } from '@/utils/connection';

class ApiClient {
  private instance: AxiosInstance;
  private apiBase: string = '';
  private managementKey: string = '';

  constructor() {
    this.instance = axios.create({
      timeout: REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  /**
   * Establecer configuración de la API
   */
  setConfig(config: ApiClientConfig): void {
    this.apiBase = computeApiUrl(config.apiBase);
    this.managementKey = config.managementKey;

    if (config.timeout) {
      this.instance.defaults.timeout = config.timeout;
    } else {
      this.instance.defaults.timeout = REQUEST_TIMEOUT_MS;
    }
  }

  private readHeader(
    headers: Record<string, unknown> | undefined,
    keys: string[]
  ): string | null {
    if (!headers) return null;

    const normalizeValue = (value: unknown): string | null => {
      if (value === undefined || value === null) return null;
      if (Array.isArray(value)) {
        const first = value.find((entry) => entry !== undefined && entry !== null && String(entry).trim());
        return first !== undefined ? String(first) : null;
      }
      const text = String(value);
      return text ? text : null;
    };

    const headerGetter = (headers as { get?: (name: string) => unknown }).get;
    if (typeof headerGetter === 'function') {
      for (const key of keys) {
        const match = normalizeValue(headerGetter.call(headers, key));
        if (match) return match;
      }
    }

    const entries =
      typeof (headers as { entries?: () => Iterable<[string, unknown]> }).entries === 'function'
        ? Array.from((headers as { entries: () => Iterable<[string, unknown]> }).entries())
        : Object.entries(headers);

    const normalized = Object.fromEntries(
      entries.map(([key, value]) => [String(key).toLowerCase(), value])
    );
    for (const key of keys) {
      const match = normalizeValue(normalized[key.toLowerCase()]);
      if (match) return match;
    }
    return null;
  }

  /**
   * Configurar interceptores de solicitud/respuesta
   */
  private setupInterceptors(): void {
    // Interceptor de solicitud
    this.instance.interceptors.request.use(
      (config) => {
        // Establecer baseURL
        config.baseURL = this.apiBase;
        if (config.url) {
          // Normalizar el endpoint de Gemini obsoleto a la ruta actual.
          config.url = config.url.replace(/\/generative-language-api-key\b/g, '/gemini-api-key');
        }

        // Añadir encabezado de autenticación
        if (this.managementKey) {
          config.headers.Authorization = `Bearer ${this.managementKey}`;
        }

        return config;
      },
      (error) => Promise.reject(this.handleError(error))
    );

    // Interceptor de respuesta
    this.instance.interceptors.response.use(
      (response) => {
        const headers = response.headers as Record<string, string | undefined>;
        const version = this.readHeader(headers, VERSION_HEADER_KEYS);
        const buildDate = this.readHeader(headers, BUILD_DATE_HEADER_KEYS);

        // Disparar evento de actualización de versión (se manejará en el store posteriormente)
        if (version || buildDate) {
          window.dispatchEvent(
            new CustomEvent('server-version-update', {
              detail: { version: version || null, buildDate: buildDate || null }
            })
          );
        }

        return response;
      },
      (error) => Promise.reject(this.handleError(error))
    );
  }

  /**
   * Manejo de errores
   */
  private handleError(error: unknown): ApiError {
    const isRecord = (value: unknown): value is Record<string, unknown> =>
      value !== null && typeof value === 'object';

    if (axios.isAxiosError(error)) {
      const responseData: unknown = error.response?.data;
      const responseRecord = isRecord(responseData) ? responseData : null;
      const errorValue = responseRecord?.error;
      const message =
        typeof errorValue === 'string'
          ? errorValue
          : isRecord(errorValue) && typeof errorValue.message === 'string'
            ? errorValue.message
            : typeof responseRecord?.message === 'string'
              ? responseRecord.message
              : error.message || 'La solicitud falló';
      const apiError = new Error(message) as ApiError;
      apiError.name = 'ApiError';
      apiError.status = error.response?.status;
      apiError.code = error.code;
      apiError.details = responseData;
      apiError.data = responseData;

      // 401 No autorizado - Disparar evento de cierre de sesión
      if (error.response?.status === 401) {
        window.dispatchEvent(new Event('unauthorized'));
      }

      return apiError;
    }

    const fallbackMessage =
      error instanceof Error ? error.message : typeof error === 'string' ? error : 'Ocurrió un error desconocido';
    const fallback = new Error(fallbackMessage) as ApiError;
    fallback.name = 'ApiError';
    return fallback;
  }

  /**
   * Solicitud GET
   */
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  /**
   * Solicitud POST
   */
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Solicitud PUT
   */
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Solicitud PATCH
   */
  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Solicitud DELETE
   */
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  /**
   * Obtener respuesta cruda (utilizada para descargas, etc.)
   */
  async getRaw(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.get(url, config);
  }

  /**
   * Enviar FormData
   */
  async postForm<T = unknown>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, formData, {
      ...config,
      headers: {
        ...(config?.headers || {}),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  /**
   * Mantener acceso a axios.request para casos específicos como descargas
   */
  async requestRaw(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }
}

// Exportar instancia única (Singleton)
export const apiClient = new ApiClient();
