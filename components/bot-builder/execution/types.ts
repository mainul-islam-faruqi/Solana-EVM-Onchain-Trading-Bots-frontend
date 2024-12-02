import { PublicKey } from '@solana/web3.js';

export interface BotStrategy {
  id: string;
  name: string;
  blocks: any[]; // Replace with proper block type
  connections: any[]; // Replace with proper connection type
}

export interface DCAConfig {
  applicationIdx: number;
  inAmount: number;
  inAmountPerCycle: number;
  cycleFrequency: number;
  minOutAmount?: number;
  maxOutAmount?: number;
  startAt?: number;
  inputMint: string;
  outputMint: string;
}

export interface ExecutionState {
  status: 'idle' | 'running' | 'paused' | 'error';
  lastUpdate: Date;
  errors: string[];
  currentBlock?: string;
  gasPrice?: number;
  networkStatus?: {
    chainId: number;
    blockNumber: number;
    timestamp: number;
  };
}

export interface ExecutionMetrics {
  profitLoss: number;
  totalTrades: number;
  successRate: number;
  lastTradeTime: number | null;
  gasUsed: number;
  avgExecutionTime?: number;
  failedTrades?: number;
  highestProfit?: number;
  lowestLoss?: number;
  totalVolume?: number;
}

export interface TradeResult {
  timestamp: number;
  success: boolean;
  profitLoss?: number;
  gasUsed: number;
  error?: string;
}

export interface BlockExecutionResult {
  success: boolean;
  error?: string;
  gasUsed: number;
  output?: any; // Replace with proper output type
} 