"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, PlayCircle, PauseCircle, Settings, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ActiveBotsList() {
  const activeBots = [
    {
      id: '1',
      name: 'ETH Grid Bot',
      type: 'Grid Trading',
      status: 'running',
      profit: 245.50,
      profitPercentage: 12.5
    },
    // Add more bots...
  ];

  return (
    <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-accent" />
            <span className="text-lightest">Active Bots</span>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {activeBots.map(bot => (
            <div 
              key={bot.id}
              className={cn(
                "p-3 rounded-lg",
                "border border-accent/10",
                "bg-darker/30 backdrop-blur-sm",
                "hover:bg-darker/50",
                "transition-all duration-200"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium text-lightest">{bot.name}</h3>
                  <p className="text-xs text-light/60">{bot.type}</p>
                </div>
                <div className="flex items-center gap-1">
                  {bot.status === 'running' ? (
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <PauseCircle className="h-4 w-4 text-accent" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <PlayCircle className="h-4 w-4 text-accent" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Settings className="h-4 w-4 text-light/60" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className={cn(
                  "flex items-center gap-1 text-sm",
                  bot.profit >= 0 ? "text-success" : "text-error"
                )}>
                  {bot.profit >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>${Math.abs(bot.profit)}</span>
                  <span className="text-xs">
                    ({bot.profitPercentage > 0 ? '+' : ''}{bot.profitPercentage}%)
                  </span>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-full text-xs",
                  "border border-success/20 bg-success/10 text-success"
                )}>
                  Running
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 