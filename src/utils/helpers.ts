/**
 * Funciones auxiliares de utilidad
 * Migrado desde el proyecto original src/utils/array.js, dom.js, html.js
 */

/**
 * Normaliza la respuesta del array (maneja casos donde el backend puede no devolver un array)
 */
export function normalizeArrayResponse<T>(data: T | T[] | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return [data];
}

/**
 * Función de eliminación de rebotes (debounce)
 */
export function debounce<This, Args extends unknown[], Return>(
  func: (this: This, ...args: Args) => Return,
  delay: number
): (this: This, ...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: This, ...args: Args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Función de regulación (throttle)
 */
export function throttle<This, Args extends unknown[], Return>(
  func: (this: This, ...args: Args) => Return,
  limit: number
): (this: This, ...args: Args) => void {
  let inThrottle: boolean;

  return function (this: This, ...args: Args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Escape de HTML (prevención de XSS)
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Generar ID único
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clonación profunda de objetos
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;

  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item)) as unknown as T;

  const source = obj as Record<string, unknown>;
  const cloned: Record<string, unknown> = {};
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      cloned[key] = deepClone(source[key]);
    }
  }
  return cloned as unknown as T;
}

/**
 * Función de retraso (sleep)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
