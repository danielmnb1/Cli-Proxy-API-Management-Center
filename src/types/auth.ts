/**
 * Definiciones de tipos relacionados con la autenticación
 * Basado en el proyecto original src/modules/login.js y src/core/connection.js
 */

// Credenciales de inicio de sesión
export interface LoginCredentials {
  apiBase: string;
  managementKey: string;
  rememberPassword?: boolean;
}

// Estado de autenticación
export interface AuthState {
  isAuthenticated: boolean;
  apiBase: string;
  managementKey: string;
  rememberPassword: boolean;
  serverVersion: string | null;
  serverBuildDate: string | null;
}

// Estado de conexión
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface ConnectionInfo {
  status: ConnectionStatus;
  lastCheck: Date | null;
  error: string | null;
}
