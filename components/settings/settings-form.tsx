"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

const profileFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  image: z.string().url().optional(),
});

const tradingFormSchema = z.object({
  autoTrading: z.boolean(),
  riskLevel: z.string(),
  maxLoss: z.string(),
  tradingHours: z.string(),
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  tradeAlerts: z.boolean(),
  riskAlerts: z.boolean(),
  performanceReports: z.boolean(),
});

export default function SettingsForm() {
  const [user, setUser] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    image: 'https://avatars.githubusercontent.com/u/1234567',
    role: 'admin' as const,
  });

  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      image: user.image,
    },
  });

  const tradingForm = useForm({
    resolver: zodResolver(tradingFormSchema),
    defaultValues: {
      autoTrading: true,
      riskLevel: "medium",
      maxLoss: "2",
      tradingHours: "24/7",
    },
  });

  const notificationForm = useForm({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      tradeAlerts: true,
      riskAlerts: true,
      performanceReports: true,
    },
  });

  function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    toast.success("Profile updated successfully");
  }

  function onTradingSubmit(data: z.infer<typeof tradingFormSchema>) {
    toast.success("Trading preferences updated");
  }

  function onNotificationSubmit(data: z.infer<typeof notificationFormSchema>) {
    toast.success("Notification settings updated");
  }

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="trading">Trading</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </Card>
      </TabsContent>

      <TabsContent value="trading" className="space-y-6">
        <Card className="p-6">
          <Form {...tradingForm}>
            <form onSubmit={tradingForm.handleSubmit(onTradingSubmit)} className="space-y-4">
              <FormField
                control={tradingForm.control}
                name="autoTrading"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Auto Trading</FormLabel>
                      <FormDescription>Enable automated trading</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator />
              <FormField
                control={tradingForm.control}
                name="riskLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Level</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={tradingForm.control}
                name="maxLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Loss (%)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" max="100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <Card className="p-6">
          <Form {...notificationForm}>
            <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
              <FormField
                control={notificationForm.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Email Notifications</FormLabel>
                      <FormDescription>Receive email updates</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator />
              <FormField
                control={notificationForm.control}
                name="tradeAlerts"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Trade Alerts</FormLabel>
                      <FormDescription>Get notified about new trades</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={notificationForm.control}
                name="riskAlerts"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Risk Alerts</FormLabel>
                      <FormDescription>Get notified about risk levels</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}