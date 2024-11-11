"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AISettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISettings({ open, onOpenChange }: AISettingsProps) {
  const [openAIKey, setOpenAIKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [temperature, setTemperature] = useState("0.7");

  // Load settings from localStorage on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOpenAIKey(localStorage.getItem("openai_key") || "");
      setAnthropicKey(localStorage.getItem("anthropic_key") || "");
      setTemperature(localStorage.getItem("ai_temperature") || "0.7");
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("openai_key", openAIKey);
      localStorage.setItem("anthropic_key", anthropicKey);
      localStorage.setItem("ai_temperature", temperature);
    }
    toast.success("Settings saved successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Assistant Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>OpenAI API Key</Label>
            <Input
              type="password"
              placeholder="sk-..."
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Used for GPT-4 Turbo and GPT-4
            </p>
          </div>
          <div className="space-y-2">
            <Label>Anthropic API Key</Label>
            <Input
              type="password"
              placeholder="sk-ant-..."
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Used for Claude 3 Opus and Claude 3 Sonnet
            </p>
          </div>
          <div className="space-y-2">
            <Label>Temperature</Label>
            <Select value={temperature} onValueChange={setTemperature}>
              <SelectTrigger>
                <SelectValue placeholder="Select temperature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - Deterministic</SelectItem>
                <SelectItem value="0.3">0.3 - Conservative</SelectItem>
                <SelectItem value="0.7">0.7 - Balanced</SelectItem>
                <SelectItem value="1">1.0 - Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}