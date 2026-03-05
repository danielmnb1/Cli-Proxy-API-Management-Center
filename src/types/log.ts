/**
 * Tipos relacionados con los registros (logs)
 * Basado en el proyecto original src/modules/logs.js
 */

// Niveles de registro
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

// Entrada de registro
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: unknown;
}

// Filtro de registros
export interface LogFilter {
  level?: LogLevel;
  searchQuery: string;
  startTime?: Date;
  endTime?: Date;
}
