"use client";

import { Progress } from "@/components/ui/progress";
import { Brain, Zap, Shield, Gauge, TrendingUp } from "lucide-react";

interface BotStatsProps {
  stats: {
    intelligence: number;
    speed: number;
    resilience: number;
    precision: number;
    adaptability: number;
  };
}

export function BotStats({ stats }: BotStatsProps) {
  const statItems = [
    {
      name: "Intelligence",
      value: stats.intelligence,
      icon: Brain,
      color: "bg-blue-500",
    },
    {
      name: "Speed",
      value: stats.speed,
      icon: Zap,
      color: "bg-yellow-500",
    },
    {
      name: "Resilience",
      value: stats.resilience,
      icon: Shield,
      color: "bg-green-500",
    },
    {
      name: "Precision",
      value: stats.precision,
      icon: Gauge,
      color: "bg-purple-500",
    },
    {
      name: "Adaptability",
      value: stats.adaptability,
      icon: TrendingUp,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-4">
      {statItems.map((stat) => (
        <div key={stat.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <stat.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{stat.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">{stat.value}%</span>
          </div>
          <div className="relative">
            <Progress value={stat.value} className="h-2" />
            <div
              className={`absolute top-0 left-0 h-2 ${stat.color} opacity-20 rounded-full`}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}