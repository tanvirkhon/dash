"use client";

import { Card } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend = "neutral"
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center pt-1">
        {trend === "up" && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
        {trend === "down" && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
        {trend === "neutral" && <Minus className="h-4 w-4 text-yellow-500 mr-1" />}
        <p className={cn(
          "text-xs",
          trend === "up" && "text-green-500",
          trend === "down" && "text-red-500",
          trend === "neutral" && "text-muted-foreground"
        )}>
          {description}
        </p>
      </div>
    </Card>
  );
}