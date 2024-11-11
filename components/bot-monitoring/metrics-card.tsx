"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  progress?: number;
  trend?: "up" | "down";
  trendValue?: string;
  valueColor?: string;
}

export function MetricsCard({
  title,
  value,
  subtitle,
  icon,
  progress,
  trend,
  trendValue,
  valueColor = "text-foreground"
}: MetricsCardProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon || (trend && (
          trend === "up" ? 
            <TrendingUp className="h-4 w-4 text-green-500" /> :
            <TrendingDown className="h-4 w-4 text-red-500" />
        ))}
      </div>
      <div className="flex items-baseline space-x-2">
        <div className={`text-2xl font-bold ${valueColor}`}>
          {value}
        </div>
        {trendValue && (
          <span className={`text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
            {trendValue}
          </span>
        )}
      </div>
      {progress !== undefined && (
        <Progress value={progress} className="h-2 mt-2" />
      )}
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">
          {subtitle}
        </p>
      )}
    </Card>
  );
}