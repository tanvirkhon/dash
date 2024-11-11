import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | AI TradeBot",
  description: "Manage your account settings and preferences",
};

export default function SettingsPage() {
  return (
    <div className="h-full p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and trading preferences
        </p>
      </div>
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <p className="text-muted-foreground">Coming soon...</p>
      </div>
    </div>
  );
}