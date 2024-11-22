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
// import { ExecutionState } from './types'
import { BotStrategy } from '../types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { DCAConfig, ExecutionState } from '../types';
import { IDL } from '@/lib/solana/idl/trading_bot';
import { PROGRAM_ID } from '@/lib/solana/program';
import { getAssociatedTokenAddress, getEscrowPDA } from '@/lib/solana/utils';

interface ExecutionPanelProps {
  strategy: BotStrategy;
  onExecutionStateChange?: (state: ExecutionState) => void;
  dcaConfig: DCAConfig;
}

export function ExecutionPanel({ strategy, onExecutionStateChange, dcaConfig }: ExecutionPanelProps) {
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

  const handleExecuteDCA = async () => {
    try {
      if (!wallet.publicKey) throw new Error("Wallet not connected");
      if (!dcaConfig.inputMint || !dcaConfig.outputMint) {
        throw new Error("Please select input and output tokens");
      }

      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );
      const program = new Program(IDL, PROGRAM_ID, provider);

      const tx = await program.methods
        .setupDca(
          dcaConfig.applicationIdx,
          dcaConfig.inAmount,
          dcaConfig.inAmountPerCycle,
          dcaConfig.cycleFrequency,
          dcaConfig.minOutAmount,
          dcaConfig.maxOutAmount,
          dcaConfig.startAt
        )
        .accounts({
          jupDcaProgram: new web3.PublicKey('JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4'),
          jupDca: new web3.PublicKey('JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4'),
          inputMint: new web3.PublicKey(dcaConfig.inputMint),  // Input token mint
          outputMint: new web3.PublicKey(dcaConfig.outputMint), // Output token mint
          user: wallet.publicKey,
          userTokenAccount: await getAssociatedTokenAddress(
            new web3.PublicKey(dcaConfig.inputMint),
            wallet.publicKey
          ),
          escrow: (await getEscrowPDA(
            wallet.publicKey,
            new web3.PublicKey(dcaConfig.inputMint),
            new web3.PublicKey(dcaConfig.outputMint),
            dcaConfig.applicationIdx
          ))[0],
          escrowInAta: await getAssociatedTokenAddress(
            new web3.PublicKey(dcaConfig.inputMint),
            escrowPDA
          ),
          escrowOutAta: await getAssociatedTokenAddress(
            new web3.PublicKey(dcaConfig.outputMint),
            escrowPDA
          ),
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc();

      setExecutionState({
        status: 'success',
        lastUpdate: new Date(),
        errors: []
      });

      toast({
        title: "DCA Setup Successful",
        description: `Transaction ID: ${tx}`,
        variant: "success",
      });

    } catch (error: any) {
      setExecutionState({
        status: 'error',
        lastUpdate: new Date(),
        errors: [error.message]
      });

      toast({
        title: "DCA Setup Failed",
        description: error.message,
        variant: "error",
      });
    }
  };

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
              className="hover:bg-accent/10 text-lighter disabled:text-lighter/50"
            >
              <PlayCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePause}
              disabled={executionState?.status !== 'running'}
              className="hover:bg-accent/10 text-lighter disabled:text-lighter/50"
            >
              <PauseCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStop}
              disabled={executionState?.status === 'idle'}
              className="hover:bg-accent/10 text-lighter disabled:text-lighter/50"
            >
              <StopCircle className="h-5 w-5" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Status */}
        <div className="flex items-center justify-between bg-darker/80 p-3 rounded-lg border border-accent/10">
          <span className="text-sm font-medium text-lighter">Status</span>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full
            ${executionState?.status === 'running' ? 'bg-success/10 text-success' : ''}
            ${executionState?.status === 'paused' ? 'bg-warning/10 text-warning' : ''}
            ${executionState?.status === 'error' ? 'bg-error/10 text-error' : ''}
            ${executionState?.status === 'idle' ? 'bg-accent/10 text-light' : ''}
          `}>
            {executionState?.status?.toUpperCase() || 'INITIALIZING'}
          </span>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* P&L */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-lighter" />
              <span className="text-sm font-medium text-lighter">P&L</span>
            </div>
            <span className={`text-lg font-bold ${metrics.profitLoss >= 0 ? 'text-success' : 'text-error'}`}>
              {formatCurrency(metrics.profitLoss)}
            </span>
          </div>

          {/* Trade Count */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-lighter" />
              <span className="text-sm font-medium text-lighter">Trades</span>
            </div>
            <span className="text-lg font-bold text-lighter">
              {metrics.totalTrades}
              <span className="text-sm text-lighter/50 ml-2">
                ({formatNumber(metrics.successRate)}% success)
              </span>
            </span>
          </div>

          {/* Gas Used */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-lighter" />
              <span className="text-sm font-medium text-lighter">Gas Used</span>
            </div>
            <span className="text-lg font-bold text-lighter">
              {formatNumber(metrics.gasUsed)} ETH
            </span>
          </div>

          {/* Last Trade */}
          <div className="bg-darker/80 p-4 rounded-lg border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-lighter" />
              <span className="text-sm font-medium text-lighter">Last Trade</span>
            </div>
            <span className="text-lg font-bold text-lighter">
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

        {/* Add DCA configuration inputs */}
        <Button 
          onClick={handleExecuteDCA}
          disabled={executionState?.status === 'running'}
        >
          Start DCA
        </Button>

        {/* Status display */}
        {executionState?.status === 'running' && (
          <div>Executing DCA strategy...</div>
        )}

        {/* Error display */}
        {executionState?.errors.length > 0 && (
          <div className="text-error">
            {executionState.errors.map((error, i) => (
              <div key={i}>{error}</div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 