import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  role: MessageRole;
  content: string;
  isLoading?: boolean;
}

export type AIProvider = 'openai' | 'claude';

interface AIServiceConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export class AIService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private currentProvider: AIProvider;
  private model: string;

  constructor(config: AIServiceConfig) {
    this.currentProvider = config.provider;
    this.model = config.model || (config.provider === 'openai' ? 'gpt-4' : 'claude-3-sonnet-20240229');

    if (!config.apiKey) {
      throw new Error(`API key not found for ${config.provider}`);
    }

    try {
      if (config.provider === 'openai') {
        this.openai = new OpenAI({ 
          apiKey: config.apiKey,
          baseURL: 'https://api.k2.khulnasoft.com/v1',
          dangerouslyAllowBrowser: true
        });
      } else {
        this.anthropic = new Anthropic({ 
          apiKey: config.apiKey,
          dangerouslyAllowBrowser: true
        });
      }
    } catch (error) {
      console.error('Error initializing AI service:', error);
      throw error;
    }
  }

  async sendMessage(messages: Message[]): Promise<string> {
    try {
      console.log('Sending message with provider:', this.currentProvider);
      console.log('Using model:', this.model);
      
      if (this.currentProvider === 'openai' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: this.model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: 0.7,
          max_tokens: 1000,
        });
        return response.choices[0].message.content || '';
      } else if (this.anthropic) {
        const response = await this.anthropic.messages.create({
          model: this.model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          max_tokens: 1024,
        });
        return response.content[0].text;
      }
      throw new Error('No AI provider configured');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
} 