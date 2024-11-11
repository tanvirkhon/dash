"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Message } from "@/lib/types/chat";

interface AIMessageProps {
  message: Message;
}

export function AIMessage({ message }: AIMessageProps) {
  const isBot = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex space-x-3",
        !isBot && "justify-end space-x-reverse"
      )}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[85%] shadow-sm",
          isBot
            ? "bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/20"
            : "bg-primary text-primary-foreground"
        )}
      >
        {message.isLoading ? (
          <LoadingSpinner />
        ) : (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        )}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}