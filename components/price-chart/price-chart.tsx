"use client";

import React from 'react';
import { HistoricalPrice, TimeFrame } from '@/lib/price-feeds/types';
import { priceService } from '@/lib/price-feeds/price-service';
import { Line } from 'react-chartjs-2';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { chartOptions } from '@/lib/chart-config';

interface PriceChartProps {
  tokenAddress: string;
  chainId: number;
}

export function PriceChart({ tokenAddress, chainId }: PriceChartProps) {
  const [timeframe, setTimeframe] = React.useState<TimeFrame>('1h');
  const [prices, setPrices] = React.useState<HistoricalPrice[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const endTime = Date.now();
        const startTime = endTime - getTimeframeMilliseconds(timeframe);
        
        const historicalPrices = await priceService.getHistoricalPrices(
          tokenAddress,
          chainId,
          timeframe,
          startTime,
          endTime
        );
        
        setPrices(historicalPrices);
      } catch (error) {
        console.error('Failed to fetch historical prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [tokenAddress, chainId, timeframe]);

  const chartData = {
    labels: prices.map(p => new Date(p.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Price',
        data: prices.map(p => p.close),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  return (
    <Card className="p-4 border-accent/20 bg-darker/50 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          {(['1m', '5m', '15m', '1h', '4h', '1d'] as TimeFrame[]).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="text-xs"
            >
              {tf.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : (
          <Line
            data={chartData}
            options={chartOptions}
          />
        )}
      </div>
    </Card>
  );
}

function getTimeframeMilliseconds(timeframe: TimeFrame): number {
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  switch (timeframe) {
    case '1m': return minute;
    case '5m': return 5 * minute;
    case '15m': return 15 * minute;
    case '1h': return hour;
    case '4h': return 4 * hour;
    case '1d': return day;
    default: return hour;
  }
} 