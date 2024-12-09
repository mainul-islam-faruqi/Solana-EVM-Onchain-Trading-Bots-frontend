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
import { ExecutionEngine } from './execution-engine'
import { ExecutionState } from './types'
import { BotStrategy } from '../types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Wallet as SolanaWallet } from '@coral-xyz/anchor'
import { DCAService } from '@/lib/services/dca-service'

interface MetricsCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
}

const MetricsCard = ({ icon, label, value, subValue }: MetricsCardProps) => (
  <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm font-medium text-lighter">{label}</span>
    </div>
    <span className="text-lg font-bold text-lighter">
      {value}
      {subValue && <span className="text-sm text-lighter/50 ml-2">{subValue}</span>}
    </span>
  </div>
);

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`text-sm font-semibold px-3 py-1 rounded-full
    ${status === 'running' ? 'bg-success/10 text-success' : ''}
    ${status === 'paused' ? 'bg-warning/10 text-warning' : ''}
    ${status === 'error' ? 'bg-error/10 text-error' : ''}
    ${status === 'idle' ? 'bg-accent/10 text-light' : ''}
  `}>
    {status.toUpperCase() || 'INITIALIZING'}
  </span>
);

interface ControlButtonsProps {
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  status: string;
}

const ControlButtons = ({ onStart, onPause, onStop, status }: ControlButtonsProps) => (
  <div className="flex items-center space-x-2">
    <Button
      variant="ghost"
      size="icon"
      onClick={onStart}
      disabled={status === 'running'}
      className="hover:bg-accent/10 text-lighter disabled:text-lighter/50"
    >
      <PlayCircle className="h-5 w-5" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={onPause}
      disabled={status !== 'running'}
      className="hover:bg-accent/10 text-lighter disabled:text-lighter/50"
    >
      <PauseCircle className="h-5 w-5" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={onStop}
      disabled={status === 'idle'}
      className="hover:bg-accent/10 text-lighter disabled:text-lighter/50"
    >
      <StopCircle className="h-5 w-5" />
    </Button>
  </div>
);

interface ExecutionPanelProps {
  strategy: BotStrategy;
  onExecutionStateChange?: (state: ExecutionState) => void;
}

export function ExecutionPanel({ strategy, onExecutionStateChange }: ExecutionPanelProps) {
  const { toast } = useToast();
  const { connection } = useConnection();
  const wallet = useWallet();
  const [engine, setEngine] = React.useState<ExecutionEngine | null>(null)
  const [executionState, setExecutionState] = React.useState<ExecutionState>({
    status: 'idle',
    lastUpdate: new Date(),
    errors: []
  });
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
    return () => { newEngine?.stop() }
  }, [strategy])

  React.useEffect(() => {
    if (!engine || executionState?.status !== 'running') return
    const interval = setInterval(() => {
      setMetrics(engine.getMetrics())
    }, 5000)
    return () => clearInterval(interval)
  }, [engine, executionState?.status])

  const updateExecutionState = (newState: ExecutionState) => {
    setExecutionState(newState);
    onExecutionStateChange?.(newState);
  };

  const handleStart = async () => {
    if (!engine) return;
    try {
      await engine.start();
      updateExecutionState(engine.getExecutionState());
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
      await engine.pause();
      updateExecutionState(engine.getExecutionState());
    }
  };

  const handleStop = async () => {
    if (engine) {
      await engine.stop();
      updateExecutionState(engine.getExecutionState());
    }
  };

  const handleStartDCA = async () => {
    if (!wallet.connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "error"
      });
      return;
    }

    try {
      const dcaBlock = strategy.blocks.find(b => b.type === 'dca');
      if (!dcaBlock) throw new Error('No DCA configuration found in strategy');

      const dcaConfig = {
        applicationIdx: Number(dcaBlock.config.applicationIdx || 0),
        inAmount: Number(dcaBlock.config.inAmount || 0),
        inAmountPerCycle: Number(dcaBlock.config.inAmountPerCycle || 0),
        cycleFrequency: Number(dcaBlock.config.cycleFrequency || 3600),
        minOutAmount: Number(dcaBlock.config.minOutAmount),
        maxOutAmount: Number(dcaBlock.config.maxOutAmount),
        startAt: Number(dcaBlock.config.startAt),
        inputMint: (dcaBlock.config as { pair: { inputToken: { mint: { toString: () => string } } } }).pair.inputToken.mint.toString() || '',
        outputMint: (dcaBlock.config as { pair: { outputToken: { mint: { toString: () => string } } } }).pair.outputToken.mint.toString() || ''
      };

      const dcaService = new DCAService(connection, wallet as unknown as SolanaWallet);
      const result = await dcaService.setupDCA(dcaConfig);

      updateExecutionState({
        status: 'running',
        lastUpdate: Date.now(),
        errors: []
      });

      toast({
        title: "DCA Setup Successful",
        description: `Transaction signature: ${result.signature}`,
        variant: "success"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      updateExecutionState({
        status: 'error',
        lastUpdate: Date.now(),
        errors: [errorMessage]
      });

      toast({
        title: "DCA Setup Failed",
        description: errorMessage,
        variant: "error"
      });
    }
  };
console.log(wallet)
  return (
    <Card className="border border-accent/20 bg-darker/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/20">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lightest">Bot Execution</span>
          <ControlButtons
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleStop}
            status={executionState.status}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Status */}
        <div className="flex items-center justify-between bg-darker/80 p-3 rounded-lg border border-accent/10">
          <span className="text-sm font-medium text-lighter">Status</span>
          <StatusBadge status={executionState.status} />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <MetricsCard
            icon={<TrendingUp className="h-4 w-4 text-lighter" />}
            label="P&L"
            value={<span className={metrics.profitLoss >= 0 ? 'text-success' : 'text-error'}>
              {formatCurrency(metrics.profitLoss)}
            </span>}
          />
          <MetricsCard
            icon={<Activity className="h-4 w-4 text-lighter" />}
            label="Trades"
            value={metrics.totalTrades}
            subValue={`(${formatNumber(metrics.successRate)}% success)`}
          />
          <MetricsCard
            icon={<Wallet className="h-4 w-4 text-lighter" />}
            label="Gas Used"
            value={`${formatNumber(metrics.gasUsed)} SOL`}
          />
          <MetricsCard
            icon={<Clock className="h-4 w-4 text-lighter" />}
            label="Last Trade"
            value={metrics.lastTradeTime ? new Date(metrics.lastTradeTime).toLocaleTimeString() : 'N/A'}
          />
        </div>

        {/* Bot Controls */}
        {strategy.blocks.find(b => b.type === 'dca') ? (
          <Button 
            onClick={handleStartDCA}
            disabled={executionState?.status === 'running' || !wallet.connected}
            className="w-full"
          >
            {wallet.connected ? 'Start DCA' : 'Connect Wallet to Start DCA'}
          </Button>
        ) : (
          <Button 
            onClick={handleStart}
            disabled={executionState?.status === 'running'}
            className="w-full"
          >
            Start Bot
          </Button>
        )}

        {/* Status Messages */}
        {executionState?.status === 'running' && (
          <div className="text-sm text-lighter">
            {strategy.blocks.find(b => b.type === 'dca') 
              ? 'DCA strategy is active and running on-chain...'
              : 'Bot is actively executing trades...'}
          </div>
        )}

        {/* Error Messages */}
        {executionState?.errors.length > 0 && (
          <div className="text-error space-y-1">
            {executionState.errors.map((error: string, i: number) => (
              <div key={i} className="text-sm">{error}</div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 