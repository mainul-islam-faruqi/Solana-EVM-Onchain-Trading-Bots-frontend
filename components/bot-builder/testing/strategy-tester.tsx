"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestResult } from '@/types/strategy';
import { BotStrategy } from '../types';
import { PlayCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { ExecutionEngine } from '../execution/execution-engine';
import { PriceChart } from '@/components/price-chart/price-chart';

interface StrategyTesterProps {
  strategy: BotStrategy;
}

export function StrategyTester({ strategy }: StrategyTesterProps) {
  const [engine, setEngine] = React.useState<ExecutionEngine | null>(null);
  const [testResults, setTestResults] = React.useState<TestResult[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize test engine
  React.useEffect(() => {
    const testEngine = new ExecutionEngine(strategy);
    setEngine(testEngine);

    return () => {
      testEngine.stop();
    };
  }, [strategy]);

  const runBacktest = async () => {
    if (!engine) return;

    try {
      // Configure for testing mode
      engine.setMode('test');
      
      // Run with historical data
      const results = await engine.executeWithHistoricalData(historicalPrices);
      
      // Show results
      setTestResults(results);
    } catch (error) {
      console.error('Backtest failed:', error);
    }
  };

  return (
    <Card className="border border-accent/20 bg-darker/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/20">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lightest">Strategy Testing</span>
          <Button
            onClick={runBacktest}
            disabled={engine ? engine.isRunning : false}
            className="flex items-center gap-2"
          >
            <PlayCircle className="h-4 w-4" />
            {engine ? engine.isRunning ? 'Simulating...' : 'Run Simulation' : 'Run Simulation'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20">
            <AlertCircle className="h-5 w-5 text-error" />
            <span className="text-sm text-error">{error}</span>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
                <div className="text-sm font-medium text-light mb-1">Total Trades</div>
                <div className="text-lg font-bold text-lightest">
                  {testResults.length}
                </div>
              </div>
              <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
                <div className="text-sm font-medium text-light mb-1">Success Rate</div>
                <div className="text-lg font-bold text-success">
                  {formatNumber(
                    (testResults.filter(r => r.success).length / testResults.length) * 100
                  )}%
                </div>
              </div>
              <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
                <div className="text-sm font-medium text-light mb-1">Avg. Gas</div>
                <div className="text-lg font-bold text-lightest">
                  {formatNumber(
                    testResults.reduce((acc, r) => acc + (r.details.gas || 0), 0) / testResults.length
                  )}
                </div>
              </div>
            </div>

            {/* Results Timeline */}
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success
                      ? 'bg-success/10 border-success/20'
                      : 'bg-error/10 border-error/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-light">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`text-sm ${
                      result.success ? 'text-success' : 'text-error'
                    }`}>
                      {result.action}
                    </span>
                  </div>
                  {result.details.price && (
                    <div className="text-xs text-light mt-1">
                      Price: {formatCurrency(result.details.price)}
                    </div>
                  )}
                  {result.details.error && (
                    <div className="text-xs text-error mt-1">
                      {result.details.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Price Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-lightest mb-4">Price History</h4>
            <PriceChart 
              tokenAddress="0x..." // Get from strategy config
              chainId={1} // Get from selected network
            />
          </div>
          <div>
            {/* Existing test results */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 