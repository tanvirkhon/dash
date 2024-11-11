"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BotParametersProps {
  parameters: {
    stopLoss: number;
    takeProfit: number;
    entryConfidence: number;
    timeframe: string;
  };
  onUpdate: (newParams: Partial<BotParametersProps["parameters"]>) => void;
}

export function BotParameters({ parameters, onUpdate }: BotParametersProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Stop Loss (%)</label>
          <Input
            type="number"
            value={parameters.stopLoss}
            onChange={(e) =>
              onUpdate({ stopLoss: parseFloat(e.target.value) || 0 })
            }
            min={0}
            max={100}
            step={0.1}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Take Profit (%)</label>
          <Input
            type="number"
            value={parameters.takeProfit}
            onChange={(e) =>
              onUpdate({ takeProfit: parseFloat(e.target.value) || 0 })
            }
            min={0}
            max={100}
            step={0.1}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Entry Confidence (%)</label>
          <Input
            type="number"
            value={parameters.entryConfidence}
            onChange={(e) =>
              onUpdate({ entryConfidence: parseFloat(e.target.value) || 0 })
            }
            min={0}
            max={100}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Timeframe</label>
          <Select
            value={parameters.timeframe}
            onValueChange={(value) => onUpdate({ timeframe: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 minute</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="15m">15 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="4h">4 hours</SelectItem>
              <SelectItem value="1d">1 day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}