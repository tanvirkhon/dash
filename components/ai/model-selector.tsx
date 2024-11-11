"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AIModelSelector() {
  return (
    <Select defaultValue="gpt-4-turbo">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select AI Model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gpt-4-turbo">GPT-4 Turbo (128k)</SelectItem>
        <SelectItem value="gpt-4">GPT-4 (8k)</SelectItem>
        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
      </SelectContent>
    </Select>
  );
}