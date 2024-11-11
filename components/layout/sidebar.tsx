"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  LayoutDashboard, 
  Bot, 
  LineChart, 
  Calculator,
  MessageSquare,
  Settings,
  Menu
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Bot Control",
    icon: Bot,
    href: "/bot-control",
  },
  {
    title: "Analytics",
    icon: LineChart,
    href: "/analytics",
  },
  {
    title: "Accounting",
    icon: Calculator,
    href: "/accounting",
  },
  {
    title: "AI Assistant",
    icon: MessageSquare,
    href: "/ai-assistant",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn(
      "relative min-h-screen border-r border-border bg-gradient-to-b from-background to-background/80 transition-all duration-300 shadow-lg",
      collapsed ? "w-16" : "w-64"
    )}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-40 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md hover:bg-accent transition-colors"
      >
        {collapsed ? (
          <Menu className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <div className="flex flex-col space-y-6 py-8">
        <div className="px-6">
          <h2 className={cn(
            "text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent transition-all duration-300",
            collapsed ? "opacity-0" : "opacity-100"
          )}>
            AI TradeBot
          </h2>
        </div>

        <nav className="space-y-2 px-3">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-lg px-4 py-3 transition-all duration-200",
                pathname === item.href 
                  ? "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-500 shadow-sm" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                pathname === item.href && "text-blue-500"
              )} />
              {!collapsed && (
                <span className={cn(
                  "font-medium",
                  pathname === item.href && "text-blue-500"
                )}>
                  {item.title}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
} 