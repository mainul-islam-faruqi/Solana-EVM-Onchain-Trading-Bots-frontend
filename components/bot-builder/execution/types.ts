import { BotStrategy } from '../types'

export type ExecutionContext = {
  strategy: BotStrategy;
  marketData: MarketData;
  walletBalance: WalletBalance;
  executionState: ExecutionState;
}

export type MarketData = {
  price: number;
  timestamp: number;
  volume24h: number;
  priceChange24h: number;
}

export type WalletBalance = {
  [token: string]: {
    amount: number;
    value: number;
  }
}

export type ExecutionStatus = 'idle' | 'running' | 'paused' | 'error';

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

export interface ExecutionState {
  status: ExecutionStatus;
  errors: string[];
  lastUpdate: number;
  currentBlock?: string;
  nextExecution?: number;
  gasPrice?: number;
  networkStatus?: {
    chainId: number;
    blockNumber: number;
    timestamp: number;
  };
}

export interface TradeResult {
  success: boolean;
  txHash?: string;
  error?: string;
  gasUsed: number;
  timestamp: number;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
}

export interface BlockExecutionResult {
  success: boolean;
  error?: string;
  output?: any;
  gasUsed: number;
}

export interface BlockExecutor {
  execute(context: ExecutionContext): Promise<void>;
  validate(context: ExecutionContext): Promise<boolean>;
} 