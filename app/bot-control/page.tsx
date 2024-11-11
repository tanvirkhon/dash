"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Settings, 
  AlertTriangle 
} from "lucide-react";

export default function BotControl() {
  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bot Control</h2>
          <p className="text-muted-foreground">
            Manage your trading bot settings and operations
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Bot Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="text-green-500 font-medium">Running</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Uptime</span>
              <span>2h 34m</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Trade</span>
              <span>5m ago</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="w-full">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Connection
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Configure Settings
            </Button>
            <Button variant="outline" className="w-full justify-start text-yellow-500">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency Stop
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Current Strategy</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Strategy</span>
                <span className="font-medium">Mean Reversion</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Timeframe</span>
                <span>5m</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Risk per Trade</span>
                <span>1%</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Settings className="w-4 h-4 mr-2" />
              Modify Strategy
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}