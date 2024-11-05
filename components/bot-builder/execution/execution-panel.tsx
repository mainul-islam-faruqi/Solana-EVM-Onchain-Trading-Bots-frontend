'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlayCircle, PauseCircle, StopCircle, AlertCircle, TrendingUp, Clock, DollarSign } from 'lucide-react'
import { ExecutionEngine } from './execution-engine'
import { ExecutionState, MarketData } from './types'
import { BotStrategy } from '../types'

interface ExecutionPanelProps {
  strategy: BotStrategy;
}

export function ExecutionPanel({ strategy }: ExecutionPanelProps) {
  const [engine, setEngine] = React.useState<ExecutionEngine | null>(null)
  const [executionState, setExecutionState] = React.useState<ExecutionState | null>(null)
  const [marketData, setMarketData] = React.useState<MarketData | null>(null)

  React.useEffect(() => {
    const newEngine = new ExecutionEngine(strategy)
    setEngine(newEngine)

    return () => {
      newEngine.stop()
    }
  }, [strategy])

  React.useEffect(() => {
    if (!engine) return

    const interval = setInterval(() => {
      setExecutionState(engine.getExecutionState())
      setMarketData(engine.getMarketData())
    }, 1000)

    return () => clearInterval(interval)
  }, [engine])

  const handleStart = async () => {
    if (engine) {
      await engine.start()
      setExecutionState(engine.getExecutionState())
    }
  }

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
    <Card className="border border-[#4895EF]/20 bg-[#1A1B41]/50 backdrop-blur-sm">
      <CardHeader className="border-b border-[#4895EF]/20">
        <CardTitle className="flex items-center justify-between">
          <span className="text-[#4CC9F0]">Bot Execution</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStart}
              disabled={executionState?.status === 'running'}
              className="hover:bg-[#4895EF]/10 text-[#4CC9F0] disabled:text-[#4CC9F0]/50"
            >
              <PlayCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePause}
              disabled={executionState?.status !== 'running'}
              className="hover:bg-[#4895EF]/10 text-[#4CC9F0] disabled:text-[#4CC9F0]/50"
            >
              <PauseCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStop}
              disabled={executionState?.status === 'idle'}
              className="hover:bg-[#4895EF]/10 text-[#4CC9F0] disabled:text-[#4CC9F0]/50"
            >
              <StopCircle className="h-5 w-5" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Status */}
        <div className="flex items-center justify-between bg-[#1A1B41]/80 p-3 rounded-lg border border-[#4895EF]/10">
          <span className="text-sm font-medium text-[#4CC9F0]/60">Status</span>
          <span className={`
            text-sm font-semibold px-3 py-1 rounded-full
            ${executionState?.status === 'running' ? 'bg-[#4CC9F0]/10 text-[#4CC9F0]' : ''}
            ${executionState?.status === 'paused' ? 'bg-[#F72585]/10 text-[#F72585]' : ''}
            ${executionState?.status === 'error' ? 'bg-[#F72585]/10 text-[#F72585]' : ''}
            ${executionState?.status === 'idle' ? 'bg-[#4895EF]/10 text-[#4895EF]' : ''}
          `}>
            {executionState?.status.toUpperCase() || 'INITIALIZING'}
          </span>
        </div>

        {/* Market Data */}
        {marketData && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#4CC9F0] flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Market Data
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1A1B41]/80 p-3 rounded-lg border border-[#4895EF]/10">
                <div className="text-xs text-[#4CC9F0]/60 mb-1">Price</div>
                <div className="text-lg font-semibold text-[#4CC9F0]">
                  ${marketData.price.toFixed(2)}
                </div>
              </div>
              <div className="bg-[#1A1B41]/80 p-3 rounded-lg border border-[#4895EF]/10">
                <div className="text-xs text-[#4CC9F0]/60 mb-1">24h Change</div>
                <div className={`text-lg font-semibold ${
                  marketData.priceChange24h >= 0 ? 'text-[#4CC9F0]' : 'text-[#F72585]'
                }`}>
                  {marketData.priceChange24h.toFixed(2)}%
                </div>
              </div>
              <div className="bg-[#1A1B41]/80 p-3 rounded-lg border border-[#4895EF]/10">
                <div className="text-xs text-[#4CC9F0]/60 mb-1">24h Volume</div>
                <div className="text-lg font-semibold text-[#4CC9F0]">
                  ${(marketData.volume24h / 1000000).toFixed(2)}M
                </div>
              </div>
              <div className="bg-[#1A1B41]/80 p-3 rounded-lg border border-[#4895EF]/10">
                <div className="text-xs text-[#4CC9F0]/60 mb-1">Last Update</div>
                <div className="text-sm font-medium text-[#4CC9F0]">
                  {new Date(marketData.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#4CC9F0] flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Recent Actions
          </h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {executionState?.executedActions.slice(-5).map((action, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between bg-[#1A1B41]/80 p-3 rounded-lg border border-[#4895EF]/10"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className={`h-4 w-4 ${
                    action.type === 'buy' ? 'text-[#4CC9F0]' : 'text-[#F72585]'
                  }`} />
                  <span className="text-sm text-[#4CC9F0]">
                    {action.type.toUpperCase()} {action.amount} @ ${action.price}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${action.status === 'completed' ? 'bg-[#4CC9F0]/10 text-[#4CC9F0]' : ''}
                  ${action.status === 'failed' ? 'bg-[#F72585]/10 text-[#F72585]' : ''}
                  ${action.status === 'pending' ? 'bg-[#4895EF]/10 text-[#4895EF]' : ''}
                `}>
                  {action.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Errors */}
        {executionState?.errors.length ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#F72585] flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Errors
            </h3>
            <div className="space-y-2 bg-[#F72585]/5 p-3 rounded-lg border border-[#F72585]/20">
              {executionState.errors.slice(-3).map((error, index) => (
                <div key={index} className="text-sm text-[#F72585]">
                  {error.message}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
} 