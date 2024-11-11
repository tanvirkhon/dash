"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  Zap,
  Brain,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  Power,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";

const mockBot = {
  id: "mega-bot-1",
  name: "Mega Bot",
  status: "active",
  riskLevel: 7,
  leverage: 2,
  tradingEnabled: true,
  autoAdjust: true,
  performance: {
    winRate: 68.5,
    profitFactor: 2.47,
    sharpeRatio: 1.85,
    maxDrawdown: -12.5,
  },
  parameters: {
    stopLoss: 2.5,
    takeProfit: 5.0,
    entryConfidence: 85,
    timeframe: "5m",
  },
  stats: {
    intelligence: 85,
    speed: 92,
    resilience: 78,
    precision: 88,
    adaptability: 95,
  },
};

export default function BotControl() {
  const [bot, setBot] = useState(mockBot);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = () => {
    setIsOptimizing(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Optimizing bot parameters...",
        success: () => {
          setIsOptimizing(false);
          setBot((prev) => ({
            ...prev,
            stats: {
              ...prev.stats,
              intelligence: Math.min(prev.stats.intelligence + 2, 100),
              adaptability: Math.min(prev.stats.adaptability + 3, 100),
            },
          }));
          return "Bot parameters optimized successfully";
        },
        error: "Failed to optimize bot parameters",
      }
    );
  };

  const toggleBot = () => {
    setBot((prev) => ({
      ...prev,
      status: prev.status === "active" ? "inactive" : "active",
    }));
    toast.success(
      bot.status === "active"
        ? "Bot deactivated successfully"
        : "Bot activated successfully"
    );
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bot Control Center</h2>
          <p className="text-muted-foreground">
            Manage and optimize your trading bot
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={bot.status === "active" ? "destructive" : "default"}
            onClick={toggleBot}
          >
            <Power className="w-4 h-4 mr-2" />
            {bot.status === "active" ? "Stop Bot" : "Start Bot"}
          </Button>
          <Button onClick={handleOptimize} disabled={isOptimizing}>
            <Settings2 className="w-4 h-4 mr-2" />
            Optimize
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Bot Status</h3>
            <Bot className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold capitalize">{bot.status}</div>
          <Progress value={bot.stats.intelligence} className="mt-2" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Win Rate</h3>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">{bot.performance.winRate}%</div>
          <Progress value={bot.performance.winRate} className="mt-2" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Risk Level</h3>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold">{bot.riskLevel}/10</div>
          <Progress value={bot.riskLevel * 10} className="mt-2" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Performance</h3>
            <Activity className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold">
            {bot.performance.profitFactor.toFixed(2)}x
          </div>
          <Progress 
            value={Math.min(bot.performance.profitFactor * 25, 100)} 
            className="mt-2" 
          />
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-6">Bot Parameters</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Stop Loss (%)</label>
                <span className="text-sm text-muted-foreground">
                  {bot.parameters.stopLoss}%
                </span>
              </div>
              <Slider
                value={[bot.parameters.stopLoss]}
                max={10}
                step={0.1}
                onValueChange={(value) =>
                  setBot((prev) => ({
                    ...prev,
                    parameters: { ...prev.parameters, stopLoss: value[0] },
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Take Profit (%)</label>
                <span className="text-sm text-muted-foreground">
                  {bot.parameters.takeProfit}%
                </span>
              </div>
              <Slider
                value={[bot.parameters.takeProfit]}
                max={20}
                step={0.1}
                onValueChange={(value) =>
                  setBot((prev) => ({
                    ...prev,
                    parameters: { ...prev.parameters, takeProfit: value[0] },
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto-Adjust</label>
                <p className="text-sm text-muted-foreground">
                  Automatically adjust parameters
                </p>
              </div>
              <Switch
                checked={bot.autoAdjust}
                onCheckedChange={(checked) =>
                  setBot((prev) => ({ ...prev, autoAdjust: checked }))
                }
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-6">Bot Stats</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Intelligence</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {bot.stats.intelligence}%
                </span>
              </div>
              <Progress value={bot.stats.intelligence} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Speed</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {bot.stats.speed}%
                </span>
              </div>
              <Progress value={bot.stats.speed} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Resilience</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {bot.stats.resilience}%
                </span>
              </div>
              <Progress value={bot.stats.resilience} className="h-2" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}