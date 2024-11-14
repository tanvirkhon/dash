"use client";

import { useState, useCallback } from 'react';
import { AIService, Message, AIProvider } from '@/services/ai-service';
import { useSettings } from '@/hooks/use-settings';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();

  const sendMessage = useCallback(async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message
      const userMessage: Message = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);

      // Validate API key
      if (!settings.apiKey) {
        throw new Error('API key not configured');
      }

      // Initialize AI service with current settings
      const aiService = new AIService({
        provider: settings.provider as AIProvider,
        apiKey: settings.apiKey,
        model: settings.model,
      });

      // Get AI response
      const response = await aiService.sendMessage([...messages, userMessage]);
      
      // Add AI response
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'An error occurred while processing your request.'}`,
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, settings]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat,
  };
}