export type RiskLevel = 'bajo' | 'medio' | 'alto' | 'critico';

export type IntentName =
  | 'info_servicio'
  | 'precio'
  | 'agenda'
  | 'transformacion'
  | 'quimica'
  | 'salud'
  | 'curso'
  | 'producto'
  | 'ubicacion'
  | 'otro';

export interface IntentResult {
  intent: IntentName;
  servicio: string | null;
  confidence: number;
}

export interface RiskResult {
  risk_score: number;
  risk_level: RiskLevel;
  factors: string[];
  reasoning: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ConversationState {
  conversation_id: string;
  created_at: string;
  last_updated: string;
  messages: ChatMessage[];
  state?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface RAGChunk {
  id: string | number;
  text: string;
  score?: number;
  payload?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ChatRequestPayload {
  message: string;
  conversation_id?: string;
  page?: string;
  user_agent?: string;
}

export interface ChatResponseMeta {
  conversation_id: string;
  risk_level: RiskLevel;
  intent: IntentResult;
  handoff?: {
    reason: string;
    whatsapp_url?: string;
  };
  sources?: Array<{
    id: string | number;
    score?: number;
    source_id?: string;
  }>;
}
