"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceChart } from '@/components/price-chart/price-chart';
import { usePriceData } from '@/hooks/usePriceData';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceMonitoringProps {
  tokenAddress: string;
  chainId: number;
}

export function PriceMonitoringPanel({ tokenAddress, chainId }: PriceMonitoringProps) {
  const { priceData, isLoading, error } = usePriceData(tokenAddress, chainId);

  return (
    <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span className="text-lightest">Price Monitor</span>
          </div>
          {priceData && (
            <div className={cn(
              "flex items-center gap-1 text-sm px-2 py-1 rounded-full",
              priceData.priceChange24h >= 0 
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            )}>
              {priceData.priceChange24h >= 0 
                ? <ArrowUp className="h-4 w-4" />
                : <ArrowDown className="h-4 w-4" />
              }
              <span>{formatNumber(Math.abs(priceData.priceChange24h))}%</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Current Price */}
        {priceData && (
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="text-sm font-medium text-light mb-1">Current Price</div>
            <div className="text-2xl font-bold text-lightest">
              {formatCurrency(priceData.price)}
            </div>
            <div className="text-xs text-light/60 mt-1">
              Updated {new Date(priceData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}

        {/* Price Chart */}
        <div className="h-[300px]">
          <PriceChart 
            tokenAddress={tokenAddress}
            chainId={chainId}
          />
        </div>

        {/* Volume Info */}
        {priceData?.volume24h && (
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="text-sm font-medium text-light mb-1">24h Volume</div>
            <div className="text-lg font-bold text-lightest">
              {formatCurrency(priceData.volume24h)}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 text-error text-sm">
            Failed to load price data: {error.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 