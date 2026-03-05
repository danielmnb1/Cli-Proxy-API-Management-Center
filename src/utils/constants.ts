/**
 * Definiciones de constantes
 * Migrado desde src/utils/constants.js del proyecto original
 */

import type { Language } from '@/types';

const defineLanguageOrder = <T extends readonly Language[]>(
  languages: T & ([Language] extends [T[number]] ? unknown : never)
) => languages;

// Tiempo de expiración de la caché (milisegundos)
export const CACHE_EXPIRY_MS = 30 * 1000; // Consistente con la línea base para reducir la presión en el centro de gestión

// Red e información de versión
export const DEFAULT_API_PORT = 8317;
export const MANAGEMENT_API_PREFIX = '/v0/management';
export const REQUEST_TIMEOUT_MS = 30 * 1000;
export const VERSION_HEADER_KEYS = ['x-cpa-version', 'x-server-version'];
export const BUILD_DATE_HEADER_KEYS = ['x-cpa-build-date', 'x-server-build-date'];
export const STATUS_UPDATE_INTERVAL_MS = 1000;
export const LOG_REFRESH_DELAY_MS = 500;

// Relacionado con logs
export const MAX_LOG_LINES = 2000;
export const LOG_FETCH_LIMIT = 2500;
export const LOGS_TIMEOUT_MS = 60 * 1000;

// Paginación de archivos de autenticación
export const DEFAULT_AUTH_FILES_PAGE_SIZE = 20;
export const MIN_AUTH_FILES_PAGE_SIZE = 10;
export const MAX_AUTH_FILES_PAGE_SIZE = 100;
export const MAX_AUTH_FILE_SIZE = 10 * 1024 * 1024;

// Nombres de claves de almacenamiento local
export const STORAGE_KEY_AUTH = 'cli-proxy-auth';
export const STORAGE_KEY_THEME = 'cli-proxy-theme';
export const STORAGE_KEY_LANGUAGE = 'cli-proxy-language';
export const STORAGE_KEY_SIDEBAR = 'cli-proxy-sidebar-collapsed';
export const STORAGE_KEY_AUTH_FILES_PAGE_SIZE = 'cli-proxy-auth-files-page-size';

// Configuración de idioma
export const LANGUAGE_ORDER = defineLanguageOrder(['zh-CN', 'en', 'ru', 'es'] as const);
export const LANGUAGE_LABEL_KEYS: Record<Language, string> = {
  'zh-CN': 'language.chinese',
  en: 'language.english',
  ru: 'language.russian',
  es: 'language.spanish'
};
export const SUPPORTED_LANGUAGES = LANGUAGE_ORDER;

// Duración de las notificaciones
export const NOTIFICATION_DURATION_MS = 3000;

// Lista de IDs de tarjetas OAuth
export const OAUTH_CARD_IDS = [
  'codex-oauth-card',
  'anthropic-oauth-card',
  'antigravity-oauth-card',
  'gemini-cli-oauth-card',
  'kimi-oauth-card',
  'qwen-oauth-card'
];
export const OAUTH_PROVIDERS = {
  CODEX: 'codex',
  ANTHROPIC: 'anthropic',
  ANTIGRAVITY: 'antigravity',
  GEMINI_CLI: 'gemini-cli',
  KIMI: 'kimi',
  QWEN: 'qwen'
} as const;

// Endpoints de la API
export const API_ENDPOINTS = {
  CONFIG: '/config',
  LOGIN: '/login',
  API_KEYS: '/api-keys',
  PROVIDERS: '/providers',
  AUTH_FILES: '/auth-files',
  OAUTH: '/oauth',
  USAGE: '/usage',
  LOGS: '/logs'
} as const;
