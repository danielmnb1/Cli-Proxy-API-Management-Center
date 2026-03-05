/**
 * Funciones de utilidad de formato
 * Migrado desde el proyecto original src/utils/string.js
 */

const resolveDefaultLocale = (): string | undefined => {
  const fromDocument =
    typeof document !== 'undefined' ? document.documentElement?.lang?.trim() : '';
  if (fromDocument) return fromDocument;
  const fromNavigator = typeof navigator !== 'undefined' ? navigator.language?.trim() : '';
  return fromNavigator || undefined;
};

/**
 * Oculta la parte central de la clave API, conservando solo los dos primeros y últimos caracteres
 */
export function maskApiKey(key: string): string {
  const trimmed = String(key || '').trim();
  if (!trimmed) {
    return '';
  }

  const MASKED_LENGTH = 10;
  const visibleChars = trimmed.length < 4 ? 1 : 2;
  const start = trimmed.slice(0, visibleChars);
  const end = trimmed.slice(-visibleChars);
  const maskedLength = Math.max(MASKED_LENGTH - visibleChars * 2, 1);
  const masked = '*'.repeat(maskedLength);

  return `${start}${masked}${end}`;
}

/**
 * Formatear tamaño de archivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Formatear fecha y hora
 */
export function formatDateTime(date: string | Date, locale?: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  const resolvedLocale = locale?.trim() || resolveDefaultLocale();
  return d.toLocaleString(resolvedLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Formatea un timestamp Unix (segundos/milisegundos/microsegundos/nanosegundos) a una cadena de tiempo local
 */
export function formatUnixTimestamp(value: unknown, locale?: string): string {
  if (value === null || value === undefined || value === '') return '';

  const asNumber = typeof value === 'number' ? value : Number(value);
  const date = (() => {
    if (!Number.isFinite(asNumber) || Number.isNaN(asNumber)) {
      return new Date(String(value));
    }

    const abs = Math.abs(asNumber);

    // Segundos: comúnmente 10 dígitos (~1e9)
    if (abs < 1e11) return new Date(asNumber * 1000);

    // Milisegundos: comúnmente 13 dígitos (~1e12)
    if (abs < 1e14) return new Date(asNumber);

    // Microsegundos: comúnmente 16 dígitos (~1e15)
    if (abs < 1e17) return new Date(Math.round(asNumber / 1000));

    // Nanosegundos: comúnmente 19 dígitos (~1e18)
    return new Date(Math.round(asNumber / 1e6));
  })();

  if (Number.isNaN(date.getTime())) return '';
  return locale ? date.toLocaleString(locale) : date.toLocaleString();
}

/**
 * Formatear número (añadir separador de miles)
 */
export function formatNumber(num: number, locale?: string): string {
  const resolvedLocale = locale?.trim() || resolveDefaultLocale();
  return num.toLocaleString(resolvedLocale);
}

/**
 * Truncar texto largo
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}
