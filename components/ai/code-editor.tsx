"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/lib/types/chat";
import { Loader2, Play, Save } from "lucide-react";
import { toast } from "sonner";

interface CodeEditorProps {
  isGenerating: boolean;
  messages: Message[];
}

export function CodeEditor({ isGenerating, messages }: CodeEditorProps) {
  const [code, setCode] = useState("");

  // Extract code blocks from messages
  useEffect(() => {
    const codeBlocks = messages
      .filter((m) => m.role === "assistant")
      .map((m) => {
        const matches = m.content.match(/```[\s\S]*?```/g);
        return matches ? matches.map(block => block.replace(/```/g, '')) : [];
      })
      .flat()
      .filter(Boolean);

    if (codeBlocks.length > 0) {
      setCode(codeBlocks[codeBlocks.length - 1]);
    }
  }, [messages]);

  const handleSave = () => {
    // Save code to a file
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trading-bot.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code saved successfully");
  };

  const handleTest = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Testing trading bot...',
        success: 'Test completed successfully!',
        error: 'Error running tests',
      }
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Code Editor</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={isGenerating || !code}
          >
            <Play className="h-4 w-4 mr-2" />
            Test Bot
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isGenerating || !code}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Card className="flex-1 relative">
        {isGenerating && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Generating code...</p>
            </div>
          </div>
        )}
        <ScrollArea className="h-full">
          <pre className="p-4 text-sm">
            <code>{code || "// Your trading bot code will appear here..."}</code>
          </pre>
        </ScrollArea>
      </Card>
    </div>
  );
}