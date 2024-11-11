"use client";

import { useState } from "react";
import { Message } from "@/lib/types/chat";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI trading assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    
    setIsLoading(true);
    
    // TODO: Implement actual API call
    // For now, simulate API response
    setTimeout(() => {
      const response: Message = {
        role: "assistant",
        content: "This is a placeholder response. API integration coming soon!",
      };
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 1000);
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm your AI trading assistant. How can I help you today?",
      },
    ]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    resetChat,
  };
}