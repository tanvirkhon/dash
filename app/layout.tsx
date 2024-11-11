import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextGen AI Trading Dashboard',
  description: 'Advanced AI-powered trading dashboard for automated trading systems',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, "h-full bg-background")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 overflow-auto p-4">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}