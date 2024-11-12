"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceChart } from '@/components/price-chart/price-chart';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Bot, 
  Activity, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Clock,
  PlayCircle,
  PauseCircle,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { ActiveBotsList } from '@/app/dashboard/components/active-bots-list';
import { PerformanceMetrics } from './components/performance-metrics';
import { RecentTransactions } from './components/recent-transactions';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-darkest to-dark">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-lightest mb-2">Dashboard</h1>
          <p className="text-lighter/90">Monitor your trading bots and market performance</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total P&L */}
          <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                  <TrendingUp className="h-5 w-5 text-light" />
                </div>
                <span className={cn(
                  "text-sm px-2 py-1 rounded-full",
                  "bg-success/10 text-success",
                  "flex items-center gap-1"
                )}>
                  <ArrowUpRight className="h-3 w-3" />
                  24.5%
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-lighter/70">Total P&L</p>
                <p className="text-2xl font-bold text-success">+$12,450.83</p>
              </div>
            </CardContent>
          </Card>

          {/* Active Bots */}
          <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <Bot className="h-5 w-5 text-violet-500" />
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  View All
                </Button>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-lighter/70">Active Bots</p>
                <p className="text-2xl font-bold text-lightest">8</p>
                <p className="text-xs text-lighter/50">of 12 total bots</p>
              </div>
            </CardContent>
          </Card>

          {/* Total Volume */}
          <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Activity className="h-5 w-5 text-blue-500" />
                </div>
                <span className={cn(
                  "text-sm px-2 py-1 rounded-full",
                  "bg-blue-500/10 text-blue-400",
                  "flex items-center gap-1"
                )}>
                  <Clock className="h-3 w-3" />
                  24h
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-lighter/70">Trading Volume</p>
                <p className="text-2xl font-bold text-lightest">$89,245.32</p>
              </div>
            </CardContent>
          </Card>

          {/* Available Balance */}
          <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Wallet className="h-5 w-5 text-emerald-500" />
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  Deposit
                </Button>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-lighter/70">Available Balance</p>
                <p className="text-2xl font-bold text-lightest">$25,450.83</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart */}
            <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
              <CardHeader className="border-b border-accent/20">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-light" />
                    <span className="text-lightest">Market Overview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">ETH/USD</Button>
                    <Button variant="outline" size="sm">BTC/USD</Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PriceChart 
                  tokenAddress="0x..." // ETH address
                  chainId={1}
                />
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <PerformanceMetrics />
          </div>

          {/* Right Column - Active Bots & Transactions */}
          <div className="space-y-6">
            {/* Active Bots */}
            <ActiveBotsList />

            {/* Recent Transactions */}
            <RecentTransactions />
          </div>
        </div>
      </div>
    </div>
  );
} 