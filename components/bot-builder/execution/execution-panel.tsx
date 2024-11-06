'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  PlayCircle, 
  PauseCircle, 
  StopCircle, 
  AlertCircle,
  TrendingUp,
  Wallet,
  Clock,
  Activity
} from 'lucide-react'
import { COLORS } from '@/lib/constants/colors'
import { ExecutionEngine } from './execution-engine'
import { ExecutionState } from './types'
import { BotStrategy } from '../types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface ExecutionPanelProps {
  strategy: BotStrategy;
}

export function ExecutionPanel({ strategy }: ExecutionPanelProps) {
  const { toast } = useToast();
  const [engine, setEngine] = React.useState<ExecutionEngine | null>(null)
  const [executionState, setExecutionState] = React.useState<ExecutionState | null>(null)
  const [metrics, setMetrics] = React.useState({
    profitLoss: 0,
    totalTrades: 0,
    successRate: 0,
    lastTradeTime: null as number | null,
    gasUsed: 0,
  })

  React.useEffect(() => {
    const newEngine = new ExecutionEngine(strategy)
    setEngine(newEngine)

    return () => {
      if (newEngine) {
        newEngine.stop()
      }
    }
  }, [strategy])

  // Update metrics periodically
  React.useEffect(() => {
    if (!engine || executionState?.status !== 'running') return

    const interval = setInterval(() => {
      const currentMetrics = engine.getMetrics()
      setMetrics(currentMetrics)
    }, 5000)

    return () => clearInterval(interval)
  }, [engine, executionState?.status])

  const handleStart = async () => {
    if (!engine) return;

    try {
      await engine.start();
      setExecutionState(engine.getExecutionState());
      toast({
        title: "Bot Started",
        description: "Strategy execution has begun",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Start Failed",
        description: error instanceof Error ? error.message : "Failed to start bot",
        variant: "error",
      });
    }
  };

  const handlePause = async () => {
    if (engine) {
      await engine.pause()
      setExecutionState(engine.getExecutionState())
    }
  }

  const handleStop = async () => {
    if (engine) {
      await engine.stop()
      setExecutionState(engine.getExecutionState())
    }
  }

  return (
    <Card className="border border-accent/20 bg-darker/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/20">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lightest">Bot Execution</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStart}
              disabled={executionState?.status === 'running'}
              className="hover:bg-accent/10 text-light disabled:text-light/50"
            >
              <PlayCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePause}
              disabled={executionState?.status !== 'running'}
              className="hover:bg-accent/10 text-light disabled:text-light/50"
            >
              <PauseCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStop}
              disabled={executionState?.status === 'idle'}
              className="hover:bg-accent/10 text-light disabled:text-light/50"
            >
              <StopCircle className="h-5 w-5" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Status */}
        <div className="flex items-center justify-between bg-darker/80 p-3 rounded-lg border border-accent/10">
          <span className="text-sm font-medium text-light">Status</span>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full
            ${executionState?.status === 'running' ? 'bg-success/10 text-success' : ''}
            ${executionState?.status === 'paused' ? 'bg-warning/10 text-warning' : ''}
            ${executionState?.status === 'error' ? 'bg-error/10 text-error' : ''}
            ${executionState?.status === 'idle' ? 'bg-accent/10 text-accent' : ''}
          `}>
            {executionState?.status?.toUpperCase() || 'INITIALIZING'}
          </span>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* P&L */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-light" />
              <span className="text-sm font-medium text-light">P&L</span>
            </div>
            <span className={`text-lg font-bold ${metrics.profitLoss >= 0 ? 'text-success' : 'text-error'}`}>
              {formatCurrency(metrics.profitLoss)}
            </span>
          </div>

          {/* Trade Count */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-light" />
              <span className="text-sm font-medium text-light">Trades</span>
            </div>
            <span className="text-lg font-bold text-light">
              {metrics.totalTrades}
              <span className="text-sm text-light/50 ml-2">
                ({formatNumber(metrics.successRate)}% success)
              </span>
            </span>
          </div>

          {/* Gas Used */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-light" />
              <span className="text-sm font-medium text-light">Gas Used</span>
            </div>
            <span className="text-lg font-bold text-light">
              {formatNumber(metrics.gasUsed)} ETH
            </span>
          </div>

          {/* Last Trade */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-light" />
              <span className="text-sm font-medium text-light">Last Trade</span>
            </div>
            <span className="text-lg font-bold text-light">
              {metrics.lastTradeTime ? new Date(metrics.lastTradeTime).toLocaleTimeString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {executionState?.status === 'error' && executionState.error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20">
            <AlertCircle className="h-5 w-5 text-error" />
            <span className="text-sm text-error">{executionState.error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 