/**
 * Tipos relacionados con estadísticas de uso
 * Basado en el proyecto original src/modules/usage.js
 */

// Tipos de período de tiempo
export type TimePeriod = 'hour' | 'day';

// Punto de datos
export interface DataPoint {
  timestamp: string;
  value: number;
}

// Estadísticas de uso del modelo
export interface ModelUsage {
  modelName: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
}

// Datos de estadísticas de uso
export interface UsageStats {
  overview: {
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
  };
  requestsData: {
    hour: DataPoint[];
    day: DataPoint[];
  };
  tokensData: {
    hour: DataPoint[];
    day: DataPoint[];
  };
  costData: {
    hour: DataPoint[];
    day: DataPoint[];
  };
  modelStats: ModelUsage[];
}

// Precio del modelo
export interface ModelPrice {
  modelName: string;
  inputPricePer1M: number;
  outputPricePer1M: number;
}
