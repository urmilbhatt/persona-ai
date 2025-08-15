export interface Persona {
  id: string;
  name: string;
  description: string;
  personality: string;
  expertise: string[];
  tone: string;
  avatar?: string;
  isCustom: boolean;
  createdAt: Date;
  createdBy?: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  personaId: string;
}

export interface ChatSession {
  id: string;
  personaId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LLMProvider {
  id: string;
  name: string;
  apiKey: string;
  model: string;
  isActive: boolean;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    tokensPerMinute: number;
  };
  usage: {
    requestsThisMinute: number;
    requestsThisHour: number;
    tokensThisMinute: number;
    lastReset: Date;
  };
}

export interface ConversationContext {
  persona: Persona;
  chatHistory: Message[];
  systemPrompt: string;
}

export type LLMType = 'openai' | 'gemini' | 'claude';

export interface LLMConfig {
  type: LLMType;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  tokensPerMinute: number;
}

export interface CreatePersonaRequest {
  name: string;
  description: string;
  personality: string;
  expertise: string[];
  tone: string;
  avatar?: string;
}

export interface ChatRequest {
  message: string;
  personaId: string;
  sessionId?: string;
  llmProviderId: string;
}
