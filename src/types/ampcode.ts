/**
 * Configuración de Amp CLI Integration (ampcode)
 */

export interface AmpcodeModelMapping {
  from: string;
  to: string;
}

export interface AmpcodeConfig {
  upstreamUrl?: string;
  upstreamApiKey?: string;
  modelMappings?: AmpcodeModelMapping[];
  forceModelMappings?: boolean;
}

