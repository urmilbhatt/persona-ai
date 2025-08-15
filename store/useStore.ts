import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Persona, Message, ChatSession, LLMProvider, ConversationContext } from '../types';

interface AppState {
  // Personas
  personas: Persona[];
  selectedPersona: Persona | null;
  
  // Chat sessions
  chatSessions: ChatSession[];
  currentSession: ChatSession | null;
  
  // LLM Providers
  llmProviders: LLMProvider[];
  activeProvider: LLMProvider | null;
  
  // UI State
  isCreatingPersona: boolean;
  isChatting: boolean;
  
  // Actions
  addPersona: (persona: Persona) => void;
  updatePersona: (id: string, updates: Partial<Persona>) => void;
  deletePersona: (id: string) => void;
  selectPersona: (persona: Persona) => void;
  
  addChatSession: (session: ChatSession) => void;
  updateChatSession: (id: string, updates: Partial<ChatSession>) => void;
  deleteChatSession: (id: string) => void;
  selectChatSession: (session: ChatSession) => void;
  
  addMessage: (sessionId: string, message: Message) => void;
  
  addLLMProvider: (provider: LLMProvider) => void;
  updateLLMProvider: (id: string, updates: Partial<LLMProvider>) => void;
  deleteLLMProvider: (id: string) => void;
  setActiveProvider: (provider: LLMProvider) => void;
  
  setCreatingPersona: (isCreating: boolean) => void;
  setChatting: (isChatting: boolean) => void;
  
  // Rate limiting
  checkRateLimit: (providerId: string) => boolean;
  incrementUsage: (providerId: string, tokens: number) => void;
}

const defaultPersonas: Persona[] = [
  {
    id: 'hitesh-choudhary',
    name: 'Hitesh Choudhary',
    description: 'Tech educator, YouTuber, and founder of iNeuron. Passionate about teaching programming and helping developers grow.',
    personality: 'Enthusiastic, encouraging, and practical. Loves to explain complex concepts in simple terms. Always motivates learners to keep coding.',
    expertise: ['Web Development', 'JavaScript', 'React', 'Node.js', 'Programming Education', 'Tech Entrepreneurship'],
    tone: 'Motivational, friendly, and educational. Uses practical examples and real-world scenarios.',
    avatar: '/avatars/hitesh.jpg',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: 'piyush-garg',
    name: 'Piyush Garg',
    description: 'Full-stack developer, tech content creator, and coding enthusiast. Shares insights on modern web development.',
    personality: 'Detail-oriented, thorough, and passionate about clean code. Enjoys diving deep into technical concepts and sharing knowledge.',
    expertise: ['Full-Stack Development', 'TypeScript', 'Next.js', 'Database Design', 'System Architecture', 'Performance Optimization'],
    tone: 'Technical, precise, and helpful. Provides detailed explanations with code examples.',
    avatar: '/avatars/piyush.jpg',
    isCustom: false,
    createdAt: new Date(),
  }
];

const defaultLLMProviders: LLMProvider[] = [
  {
    id: 'openai-default',
    name: 'OpenAI GPT-4',
    apiKey: '',
    model: 'gpt-4',
    isActive: false,
    rateLimit: {
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      tokensPerMinute: 10000,
    },
    usage: {
      requestsThisMinute: 0,
      requestsThisHour: 0,
      tokensThisMinute: 0,
      lastReset: new Date(),
    },
  },
  {
    id: 'gemini-default',
    name: 'Google Gemini Pro',
    apiKey: '',
    model: 'gemini-pro',
    isActive: false,
    rateLimit: {
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      tokensPerMinute: 15000,
    },
    usage: {
      requestsThisMinute: 0,
      requestsThisHour: 0,
      tokensThisMinute: 0,
      lastReset: new Date(),
    },
  },
  {
    id: 'claude-default',
    name: 'Anthropic Claude',
    apiKey: '',
    model: 'claude-3-sonnet-20240229',
    isActive: false,
    rateLimit: {
      requestsPerMinute: 50,
      requestsPerHour: 800,
      tokensPerMinute: 12000,
    },
    usage: {
      requestsThisMinute: 0,
      requestsThisHour: 0,
      tokensThisMinute: 0,
      lastReset: new Date(),
    },
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      personas: defaultPersonas,
      selectedPersona: null,
      chatSessions: [],
      currentSession: null,
      llmProviders: defaultLLMProviders,
      activeProvider: null,
      isCreatingPersona: false,
      isChatting: false,

      // Persona actions
      addPersona: (persona) => set((state) => ({
        personas: [...state.personas, persona],
      })),

      updatePersona: (id, updates) => set((state) => ({
        personas: state.personas.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      })),

      deletePersona: (id) => set((state) => ({
        personas: state.personas.filter((p) => p.id !== id),
        selectedPersona: state.selectedPersona?.id === id ? null : state.selectedPersona,
      })),

      selectPersona: (persona) => set({ selectedPersona: persona }),

      // Chat session actions
      addChatSession: (session) => set((state) => ({
        chatSessions: [...state.chatSessions, session],
        currentSession: session,
      })),

      updateChatSession: (id, updates) => set((state) => ({
        chatSessions: state.chatSessions.map((s) =>
          s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s
        ),
        currentSession: state.currentSession?.id === id 
          ? { ...state.currentSession, ...updates, updatedAt: new Date() }
          : state.currentSession,
      })),

      deleteChatSession: (id) => set((state) => ({
        chatSessions: state.chatSessions.filter((s) => s.id !== id),
        currentSession: state.currentSession?.id === id ? null : state.currentSession,
      })),

      selectChatSession: (session) => set({ currentSession: session }),

      addMessage: (sessionId, message) => set((state) => ({
        chatSessions: state.chatSessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                messages: [...s.messages, message],
                updatedAt: new Date(),
              }
            : s
        ),
        currentSession: state.currentSession?.id === sessionId
          ? {
              ...state.currentSession,
              messages: [...state.currentSession.messages, message],
              updatedAt: new Date(),
            }
          : state.currentSession,
      })),

      // LLM Provider actions
      addLLMProvider: (provider) => set((state) => ({
        llmProviders: [...state.llmProviders, provider],
      })),

      updateLLMProvider: (id, updates) => set((state) => ({
        llmProviders: state.llmProviders.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
        activeProvider: state.activeProvider?.id === id 
          ? { ...state.activeProvider, ...updates }
          : state.activeProvider,
      })),

      deleteLLMProvider: (id) => set((state) => ({
        llmProviders: state.llmProviders.filter((p) => p.id !== id),
        activeProvider: state.activeProvider?.id === id ? null : state.activeProvider,
      })),

      setActiveProvider: (provider) => set({ activeProvider: provider }),

      // UI state actions
      setCreatingPersona: (isCreating) => set({ isCreatingPersona: isCreating }),
      setChatting: (isChatting) => set({ isChatting: isChatting }),

      // Rate limiting
      checkRateLimit: (providerId) => {
        const state = get();
        const provider = state.llmProviders.find((p) => p.id === providerId);
        if (!provider) return false;

        const now = new Date();
        const timeSinceReset = now.getTime() - provider.usage.lastReset.getTime();
        
        // Reset counters if an hour has passed
        if (timeSinceReset > 60 * 60 * 1000) {
          set((state) => ({
            llmProviders: state.llmProviders.map((p) =>
              p.id === providerId
                ? {
                    ...p,
                    usage: {
                      ...p.usage,
                      requestsThisHour: 0,
                      tokensThisHour: 0,
                      lastReset: now,
                    },
                  }
                : p
            ),
          }));
          return true;
        }

        // Check rate limits
        if (provider.usage.requestsThisHour >= provider.rateLimit.requestsPerHour) {
          return false;
        }

        if (provider.usage.tokensThisHour >= provider.rateLimit.tokensPerHour) {
          return false;
        }

        return true;
      },

      incrementUsage: (providerId, tokens) => set((state) => ({
        llmProviders: state.llmProviders.map((p) =>
          p.id === providerId
            ? {
                ...p,
                usage: {
                  ...p.usage,
                  requestsThisHour: p.usage.requestsThisHour + 1,
                  tokensThisHour: p.usage.tokensThisHour + tokens,
                },
              }
            : p
        ),
        activeProvider: state.activeProvider?.id === providerId
          ? {
              ...state.activeProvider,
              usage: {
                ...state.activeProvider.usage,
                requestsThisHour: state.activeProvider.usage.requestsThisHour + 1,
                tokensThisHour: state.activeProvider.usage.tokensThisHour + tokens,
              },
            }
          : state.activeProvider,
      })),
    }),
    {
      name: 'persona-ai-storage',
      partialize: (state) => ({
        personas: state.personas,
        llmProviders: state.llmProviders,
        chatSessions: state.chatSessions,
      }),
    }
  )
);
