import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { LLMConfig, Persona, Message, LLMType } from '../types';

export class LLMService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;
  private anthropic: Anthropic | null = null;

  constructor() {}

  private initializeProvider(type: LLMType, apiKey: string) {
    switch (type) {
      case 'openai':
        if (!this.openai) {
          this.openai = new OpenAI({ apiKey });
        }
        break;
      case 'gemini':
        if (!this.gemini) {
          this.gemini = new GoogleGenerativeAI(apiKey);
        }
        break;
      case 'claude':
        if (!this.anthropic) {
          this.anthropic = new Anthropic({ apiKey });
        }
        break;
    }
  }

  private generateSystemPrompt(persona: Persona, chatHistory: Message[]): string {
    const recentMessages = chatHistory.slice(-10); // Last 10 messages for context
    
    let contextPrompt = '';
    if (recentMessages.length > 0) {
      contextPrompt = '\n\nRecent conversation context:\n' + 
        recentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    }

    return `You are ${persona.name}, a ${persona.description}.

Personality: ${persona.personality}

Expertise: ${persona.expertise.join(', ')}

Tone: ${persona.tone}

Instructions:
- Always respond as ${persona.name} would
- Stay true to your personality and expertise
- Use your characteristic tone and style
- Provide helpful, engaging responses
- If asked about something outside your expertise, acknowledge it and redirect to what you do know
- Keep responses conversational and natural${contextPrompt}

Remember: You ARE ${persona.name}. Respond as they would, not as an AI assistant.`;
  }

  async generateResponse(
    config: LLMConfig,
    persona: Persona,
    userMessage: string,
    chatHistory: Message[],
    estimatedTokens: number = 100
  ): Promise<{ content: string; tokensUsed: number }> {
    this.initializeProvider(config.type, config.apiKey);
    
    const systemPrompt = this.generateSystemPrompt(persona, chatHistory);
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userMessage }
    ];

    try {
      switch (config.type) {
        case 'openai':
          return await this.generateOpenAIResponse(config, messages, estimatedTokens);
        case 'gemini':
          return await this.generateGeminiResponse(config, messages, estimatedTokens);
        case 'claude':
          return await this.generateClaudeResponse(config, messages, estimatedTokens);
        default:
          throw new Error(`Unsupported LLM type: ${config.type}`);
      }
    } catch (error) {
      console.error(`Error generating response with ${config.type}:`, error);
      throw error;
    }
  }

  private async generateOpenAIResponse(
    config: LLMConfig,
    messages: Array<{ role: 'system' | 'user'; content: string }>,
    estimatedTokens: number
  ): Promise<{ content: string; tokensUsed: number }> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    const completion = await this.openai.chat.completions.create({
      model: config.model,
      messages: messages as any,
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 500,
    });

    const content = completion.choices[0]?.message?.content || '';
    const tokensUsed = completion.usage?.total_tokens || estimatedTokens;

    return { content, tokensUsed };
  }

  private async generateGeminiResponse(
    config: LLMConfig,
    messages: Array<{ role: 'system' | 'user'; content: string }>,
    estimatedTokens: number
  ): Promise<{ content: string; tokensUsed: number }> {
    if (!this.gemini) {
      throw new Error('Gemini client not initialized');
    }

    const model = this.gemini.getGenerativeModel({ model: config.model });
    
    // Combine system and user messages for Gemini
    const combinedPrompt = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
    
    const result = await model.generateContent(combinedPrompt);
    const content = result.response.text() || '';
    
    // Gemini doesn't provide token usage in the same way, so we estimate
    const tokensUsed = Math.max(estimatedTokens, content.split(' ').length * 1.3);

    return { content, tokensUsed };
  }

  private async generateClaudeResponse(
    config: LLMConfig,
    messages: Array<{ role: 'system' | 'user'; content: string }>,
    estimatedTokens: number
  ): Promise<{ content: string; tokensUsed: number }> {
    if (!this.anthropic) {
      throw new Error('Anthropic client not initialized');
    }

    // Convert to Claude format
    const claudeMessages = messages.map(msg => ({
      role: msg.role === 'system' ? 'user' : msg.role,
      content: msg.role === 'system' ? `System: ${msg.content}` : msg.content
    }));

    const message = await this.anthropic.messages.create({
      model: config.model,
      max_tokens: config.maxTokens || 500,
      temperature: config.temperature || 0.7,
      messages: claudeMessages as any,
    });

    const content = message.content[0]?.text || '';
    const tokensUsed = message.usage?.input_tokens + message.usage?.output_tokens || estimatedTokens;

    return { content, tokensUsed };
  }

  // Estimate token count for a message
  estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  // Validate API key format (basic validation)
  validateAPIKey(type: LLMType, apiKey: string): boolean {
    if (!apiKey || apiKey.trim().length === 0) return false;
    
    switch (type) {
      case 'openai':
        return apiKey.startsWith('sk-') && apiKey.length > 20;
      case 'gemini':
        return apiKey.length > 20; // Google API keys are typically long
      case 'claude':
        return apiKey.startsWith('sk-ant-') && apiKey.length > 20;
      default:
        return false;
    }
  }
}

export const llmService = new LLMService();
