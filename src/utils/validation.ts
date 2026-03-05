/**
 * Funciones de utilidad para validación
 */

/**
 * Validar el formato de una URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validar la URL base de la API
 */
export function isValidApiBase(apiBase: string): boolean {
  if (!apiBase) return false;

  // Permitir protocolos http/https
  const urlPattern = /^https?:\/\/.+/i;
  return urlPattern.test(apiBase);
}

/**
 * Validar el formato de la clave de API (API Key)
 */
export function isValidApiKey(key: string): boolean {
  if (!key || key.length < 8) return false;

  // Validación básica: no debe contener espacios
  return !/\s/.test(key);
}

/**
 * Validar el conjunto de caracteres de la clave de API (solo caracteres ASCII visibles)
 */
export function isValidApiKeyCharset(key: string): boolean {
  if (!key) return false;
  return /^[\x21-\x7E]+$/.test(key);
}

/**
 * Validar formato JSON
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validar formato de correo electrónico (Email)
 */
export function isValidEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
