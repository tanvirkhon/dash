"use client";

import { Card } from "@/components/ui/card";
import { Calculator, DollarSign, TrendingUp, Wallet } from "lucide-react";

export default function Accounting() {
  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounting</h2>
          <p className="text-muted-foreground">
            Track your trading performance and finances
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Profit</p>
              <p className="text-2xl font-bold">$2,458.00</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Calculator className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">ROI</p>
              <p className="text-2xl font-bold">+24.58%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Wallet className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold">$12,458.00</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Monthly Growth</p>
              <p className="text-2xl font-bold">+8.12%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Trade #{i + 1}</p>
                  <p className="text-sm text-muted-foreground">Nov 10, 2023</p>
                </div>
                <p className="text-green-500 font-medium">+$245.00</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Win Rate</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="flex justify-between">
              <span>Profit Factor</span>
              <span className="font-medium">2.31</span>
            </div>
            <div className="flex justify-between">
              <span>Average Trade</span>
              <span className="font-medium">$125.45</span>
            </div>
            <div className="flex justify-between">
              <span>Max Drawdown</span>
              <span className="font-medium text-red-500">-12.34%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}