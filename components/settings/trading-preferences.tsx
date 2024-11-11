"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function TradingPreferences() {
  const handleSave = () => {
    toast.success("Trading preferences updated");
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Risk Management</Label>
            <p className="text-sm text-muted-foreground">
              Maximum risk per trade
            </p>
          </div>
          <Select defaultValue="2">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select risk %" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1% per trade</SelectItem>
              <SelectItem value="2">2% per trade</SelectItem>
              <SelectItem value="3">3% per trade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto Trading</Label>
            <p className="text-sm text-muted-foreground">
              Enable automated trading execution
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Trading Hours</Label>
            <p className="text-sm text-muted-foreground">
              Restrict trading to market hours
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Stop Loss</Label>
            <p className="text-sm text-muted-foreground">
              Mandatory stop loss orders
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Preferences
      </Button>
    </Card>
  );
}