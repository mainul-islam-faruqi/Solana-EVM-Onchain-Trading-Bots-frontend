"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Line } from 'react-chartjs-2';
import { chartOptions } from '@/lib/chart-config';
import { 
  TrendingUp, 
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/lib/utils';

export function PerformanceMetrics() {
  const [timeframe, setTimeframe] = React.useState<'1D' | '1W' | '1M' | 'ALL'>('1W');
  const [metrics, setMetrics] = React.useState({
    totalPnL: 12450.83,
    pnlChange: 24.5,
    winRate: 68.5,
    avgReturn: 1.8,
    bestTrade: 890.45,
    worstTrade: -234.56,
  });

  // Mock data for the chart
  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'P&L',
        data: Array.from({ length: 24 }, () => Math.random() * 1000),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  return (
    <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span className="text-lightest">Performance Metrics</span>
          </div>
          <div className="flex items-center gap-2">
            {(['1D', '1W', '1M', 'ALL'] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "text-xs",
                  timeframe === tf
                    ? "bg-accent text-white"
                    : "text-accent hover:text-accent"
                )}
              >
                {tf}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-3 gap-4">
          {/* Total P&L */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-light/60">Total P&L</span>
              <div className={cn(
                "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                metrics.pnlChange >= 0 
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              )}>
                {metrics.pnlChange >= 0 
                  ? <ArrowUpRight className="h-3 w-3" />
                  : <ArrowDownRight className="h-3 w-3" />
                }
                <span>{formatNumber(Math.abs(metrics.pnlChange))}%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-lightest">
              {formatCurrency(metrics.totalPnL)}
            </div>
          </div>

          {/* Win Rate */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-light/60">Win Rate</span>
              <div className="text-xs text-light/40">Last 50 trades</div>
            </div>
            <div className="text-2xl font-bold text-lightest">
              {formatNumber(metrics.winRate)}%
            </div>
          </div>

          {/* Average Return */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-light/60">Avg. Return</span>
              <div className="text-xs text-light/40">Per trade</div>
            </div>
            <div className="text-2xl font-bold text-lightest">
              {formatNumber(metrics.avgReturn)}%
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px]">
          <Line data={chartData} options={chartOptions as any} />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4">
          {/* Best Trade */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="h-4 w-4 text-success" />
              <span className="text-sm text-light/60">Best Trade</span>
            </div>
            <div className="text-xl font-bold text-success">
              +{formatCurrency(metrics.bestTrade)}
            </div>
          </div>

          {/* Worst Trade */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="h-4 w-4 text-error" />
              <span className="text-sm text-light/60">Worst Trade</span>
            </div>
            <div className="text-xl font-bold text-error">
              {formatCurrency(metrics.worstTrade)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 