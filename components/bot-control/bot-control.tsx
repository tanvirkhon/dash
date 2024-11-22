"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Power, Activity } from "lucide-react";
import { toast } from "sonner";
import { botService } from "@/services/botService";

export default function BotControl() {
  const [enabled, setEnabled] = useState(false);
  const [leverage, setLeverage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  // Function to check bot status
  const checkStatus = async () => {
    try {
      console.log("Checking K2 bot status...");
      const status = await botService.checkStatus();
      setEnabled(status.enabled);
      setLeverage(status.leverage);
      setLastChecked(new Date());
    } catch (error) {
      console.error("Error checking status:", error);
      toast.error("Failed to get bot status");
    }
  };

  // Check status every 30 seconds
  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleBot = async () => {
    setIsLoading(true);
    try {
      const success = enabled 
        ? await botService.turnOff()
        : await botService.turnOn();
      
      if (success) {
        setEnabled(!enabled);
        toast.success(`Bot ${enabled ? 'stopped' : 'started'} successfully`);
      }
    } catch (error) {
      console.error("Error toggling bot:", error);
      toast.error("Failed to toggle bot");
    }
    setIsLoading(false);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className={enabled ? "text-green-500" : "text-gray-400"} />
            <span className="font-medium">K2 Trading Bot</span>
          </div>
          <div className="text-sm text-gray-500">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Current Leverage:</span>
          <span className="font-medium">{leverage}x</span>
        </div>

        <Button
          onClick={toggleBot}
          disabled={isLoading}
          variant={enabled ? "destructive" : "default"}
          className="w-full"
        >
          <Power className="w-4 h-4 mr-2" />
          {isLoading ? 'Processing...' : enabled ? 'Stop Bot' : 'Start Bot'}
        </Button>
      </div>
    </Card>
  );
}