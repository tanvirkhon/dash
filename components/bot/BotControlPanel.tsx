'use client';

import { useEffect, useState } from 'react';
import { botService } from '@/services/botService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function BotControlPanel() {
  const [botEnabled, setBotEnabled] = useState(false);
  const [leverage, setLeverage] = useState(1);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    try {
      const status = await botService.checkStatus();
      setBotEnabled(status.enabled);
      setLeverage(status.leverage);
    } catch (error) {
      console.error('Failed to fetch bot status:', error);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const success = botEnabled 
        ? await botService.turnOff()
        : await botService.turnOn();
      
      if (success) {
        setBotEnabled(!botEnabled);
      }
    } catch (error) {
      console.error('Failed to toggle bot:', error);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          K2 Trading Bot
          <Badge variant={botEnabled ? "success" : "secondary"}>
            {botEnabled ? 'Running' : 'Stopped'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Leverage:</span>
            <span className="font-medium">{leverage}x</span>
          </div>
          <Button 
            onClick={handleToggle}
            disabled={loading}
            variant={botEnabled ? "destructive" : "default"}
            className="w-full"
          >
            {loading ? 'Processing...' : botEnabled ? 'Stop Bot' : 'Start Bot'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
