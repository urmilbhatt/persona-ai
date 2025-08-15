import { NextRequest, NextResponse } from 'next/server';
import { llmService } from '../../../services/llmService';
import { LLMConfig, LLMType } from '../../../types';

export async function POST(request: NextRequest) {
  try {
    const { message, personaId, sessionId, llmProviderId } = await request.json();

    if (!message || !personaId || !llmProviderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get persona and LLM provider from the request
    // In a real app, you'd fetch these from your database
    const persona = {
      id: personaId,
      name: 'Test Persona',
      description: 'A test persona',
      personality: 'Helpful and friendly',
      expertise: ['General Knowledge'],
      tone: 'Conversational',
      isCustom: false,
      createdAt: new Date(),
    };

    const llmConfig: LLMConfig = {
      type: 'openai' as LLMType, // This should come from the provider
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 500,
    };

    if (!llmConfig.apiKey) {
      return NextResponse.json(
        { error: 'LLM API key not configured' },
        { status: 500 }
      );
    }

    // Generate response
    const response = await llmService.generateResponse(
      llmConfig,
      persona,
      message,
      [], // Empty chat history for now
      100
    );

    return NextResponse.json({
      content: response.content,
      tokensUsed: response.tokensUsed,
      sessionId: sessionId || `session_${Date.now()}`,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
