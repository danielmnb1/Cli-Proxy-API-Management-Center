/**
 * Servicio de almacenamiento seguro
 * Basado en el archivo del proyecto original src/utils/secure-storage.js
 */

import { encryptData, decryptData } from '@/utils/encryption';

interface StorageOptions {
  encrypt?: boolean;
}

class SecureStorageService {
  /**
   * Almacenar datos
   */
  setItem(key: string, value: unknown, options: StorageOptions = {}): void {
    const { encrypt = true } = options;

    if (value === null || value === undefined) {
      this.removeItem(key);
      return;
    }

    const stringValue = JSON.stringify(value);
    const storedValue = encrypt ? encryptData(stringValue) : stringValue;

    localStorage.setItem(key, storedValue);
  }

  /**
   * Obtener datos
   */
  getItem<T = unknown>(key: string, options: StorageOptions = {}): T | null {
    const { encrypt = true } = options;

    const raw = localStorage.getItem(key);
    if (raw === null) return null;

    try {
      const decrypted = encrypt ? decryptData(raw) : raw;
      return JSON.parse(decrypted) as T;
    } catch {
      // Falló el análisis JSON, intentar compatibilidad con datos de cadena simple antiguos (no formato JSON)
      try {
        // Si está cifrado, intentar descifrar y devolver directamente
        if (encrypt && raw.startsWith('enc::v1::')) {
          const decrypted = decryptData(raw);
          // Después del descifrado, si aún no es JSON, devolver la cadena original
          return decrypted as T;
        }
        // Cadena simple no cifrada, devolver directamente
        return raw as T;
      } catch {
        // Fallo total, devolver null silenciosamente (para evitar contaminar la consola)
        return null;
      }
    }
  }

  /**
   * Eliminar datos
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Limpiar todos los datos
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * Migrar claves antiguas de texto plano a formato cifrado
   */
  migratePlaintextKeys(keys: string[]): void {
    keys.forEach((key) => {
      const raw = localStorage.getItem(key);
      if (!raw) return;

      // Si ya está en formato cifrado, omitir
      if (raw.startsWith('enc::v1::')) {
        return;
      }

      let parsed: unknown = raw;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // El valor original no es JSON, usar la cadena directamente
        parsed = raw;
      }

      try {
        this.setItem(key, parsed);
      } catch (error) {
        console.warn(`Failed to migrate key "${key}":`, error);
      }
    });
  }

  /**
   * Comprobar si existe la clave
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}

export const secureStorage = new SecureStorageService();
