/**
 * Tipos relacionados con OAuth
 * Basado en el proyecto original src/modules/oauth.js
 */

// Tipos de proveedores OAuth
export type OAuthProvider =
  | 'codex'
  | 'anthropic'
  | 'antigravity'
  | 'gemini-cli'
  | 'kimi'
  | 'qwen';

// Estado del flujo OAuth
export interface OAuthFlow {
  provider: OAuthProvider;
  deviceCode: string;
  userCode: string;
  verificationUrl: string;
  expiresAt: Date;
  interval: number;
  status: 'pending' | 'authorized' | 'expired' | 'error';
}

// Configuración OAuth
export interface OAuthConfig {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
}

// Lista de modelos excluidos de OAuth
export interface OAuthExcludedModels {
  models: string[];
}

// Alias de modelos OAuth
export interface OAuthModelAliasEntry {
  name: string;
  alias: string;
  fork?: boolean;
}

export type OAuthModelAlias = Record<string, OAuthModelAliasEntry[]>;
