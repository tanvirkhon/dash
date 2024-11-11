"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIMessage } from "./message";
import { AIModelSelector } from "./model-selector";
import { AISettings } from "./settings-dialog";
import { CodeEditor } from "./code-editor";
import { BacktestVisualizer } from "./backtest-visualizer";
import { useChat } from "@/hooks/use-chat";
import {
  Bot,
  Send,
  RefreshCcw,
  Settings2,
  Code,
  LineChart,
  Sparkles,
  ChevronDown,
  Loader2,
  PanelLeftOpen,
  PanelRightOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EXAMPLE_PROMPTS = [
  {
    category: "Trading Strategy",
    prompts: [
      "Create a mean reversion trading bot for SOL with a 2.5% stop loss",
      "Analyze the performance of my current trading strategy",
      "Optimize my bot's entry and exit conditions",
      "Explain the Kelly Criterion and how to apply it",
    ]
  },
  {
    category: "Technical Analysis",
    prompts: [
      "Explain how to combine RSI with MACD for better signals",
      "Create a custom indicator for volatility detection",
      "What's the best timeframe for swing trading SOL?",
      "How to identify potential breakout patterns",
    ]
  },
  {
    category: "Risk Management",
    prompts: [
      "Calculate optimal position size based on my account",
      "How to implement dynamic stop losses",
      "Create a risk management strategy for my portfolio",
      "Analyze my current drawdown and suggest improvements",
    ]
  }
];

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage, resetChat } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (activeTab === "code") {
      setIsGeneratingCode(true);
    }
    
    await sendMessage(input);
    setInput("");
    
    if (activeTab === "code") {
      setIsGeneratingCode(false);
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-blue-500" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Your intelligent trading companion
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <AIModelSelector />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? (
                <PanelRightOpen className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(true)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={resetChat}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="flex-1 flex flex-col bg-gradient-to-b from-background to-muted/20">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <div className="px-4 pt-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="backtest" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Backtest
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 flex flex-col mt-0 p-4">
              <ScrollArea className="flex-1">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {messages.map((message, i) => (
                    <AIMessage key={i} message={message} />
                  ))}
                  {isLoading && (
                    <AIMessage
                      message={{
                        role: "assistant",
                        content: "Thinking...",
                        isLoading: true,
                      }}
                    />
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="code" className="flex-1 mt-0 px-4">
              <CodeEditor 
                isGenerating={isGeneratingCode}
                messages={messages}
              />
            </TabsContent>

            <TabsContent value="backtest" className="flex-1 mt-0 px-4">
              <BacktestVisualizer messages={messages} />
            </TabsContent>

            <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form onSubmit={handleSubmit} className="flex space-x-2 max-w-3xl mx-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[300px]">
                    {EXAMPLE_PROMPTS.map((category) => (
                      <div key={category.category} className="p-2">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          {category.category}
                        </h4>
                        {category.prompts.map((prompt, i) => (
                          <DropdownMenuItem
                            key={i}
                            onClick={() => handleExampleClick(prompt)}
                          >
                            {prompt}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Input
                  placeholder={
                    activeTab === "chat"
                      ? "Ask anything about trading..."
                      : activeTab === "code"
                      ? "Describe the trading bot you want to create..."
                      : "Describe the strategy to backtest..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />

                <Button 
                  type="submit" 
                  disabled={isLoading || isGeneratingCode}
                >
                  {isLoading || isGeneratingCode ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </Tabs>
        </Card>
      </div>

      {/* Right Sidebar */}
      {showSidebar && (
        <div className="w-80 border-l p-4 space-y-4 bg-muted/10">
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="h-auto py-4 px-2 flex flex-col items-center gap-2"
                onClick={() => {
                  setActiveTab("code");
                  setInput("Create a trading bot that");
                }}
              >
                <Code className="h-5 w-5" />
                <span className="text-xs">New Bot</span>
              </Button>
              <Button 
                variant="outline"
                className="h-auto py-4 px-2 flex flex-col items-center gap-2"
                onClick={() => {
                  setActiveTab("backtest");
                  setInput("Backtest a strategy that");
                }}
              >
                <LineChart className="h-5 w-5" />
                <span className="text-xs">Backtest</span>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Recent Conversations</h3>
            <div className="space-y-2">
              {messages.filter(m => m.role === "user").slice(-3).map((message, i) => (
                <Card 
                  key={i} 
                  className="p-2 text-sm cursor-pointer hover:bg-accent"
                  onClick={() => setInput(message.content)}
                >
                  <p className="line-clamp-2">{message.content}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Trading Tips</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Use multiple timeframes for confirmation</p>
              <p>• Always set stop losses</p>
              <p>• Don't risk more than 1-2% per trade</p>
              <p>• Keep a trading journal</p>
            </div>
          </div>
        </div>
      )}

      <AISettings open={showSettings} onOpenChange={setShowSettings} />
    </div>
  );
}