"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/hooks/use-settings";

interface AISettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISettings({ open, onOpenChange }: AISettingsProps) {
  const { settings, updateSettings } = useSettings();

  const handleProviderChange = (value: string) => {
    updateSettings({ 
      provider: value,
      model: value === 'openai' ? 'gpt-4' : 'claude-3-sonnet-20240229'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              value={settings.provider}
              onValueChange={handleProviderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">K2 (OpenAI)</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              value={settings.apiKey}
              disabled
              placeholder="API key is set via environment variables"
            />
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Select
              value={settings.model}
              onValueChange={(value) => updateSettings({ model: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {settings.provider === 'openai' ? (
                  <>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}