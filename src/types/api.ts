/**
 * Definición de tipos relacionados con la API
 * Basado en el proyecto original src/core/api-client.js y varias API de módulos
 */

// Métodos HTTP
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Configuración del cliente API
export interface ApiClientConfig {
  apiBase: string;
  managementKey: string;
  timeout?: number;
}

// Opciones de solicitud
export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
}

// Información de versión del servidor
export interface ServerVersion {
  version: string;
  buildDate?: string;
}

// Error de API
export type ApiError = Error & {
  status?: number;
  code?: string;
  details?: unknown;
  data?: unknown;
};
