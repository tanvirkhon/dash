"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function NotificationSettings() {
  const handleSave = () => {
    toast.success("Notification settings updated");
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Trade Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Get notified for new trades
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Performance Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Daily performance summaries
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Risk Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Notifications for high-risk situations
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates via email
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Notification Settings
      </Button>
    </Card>
  );
}