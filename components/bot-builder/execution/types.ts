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

export type ExecutionState = {
  status: 'idle' | 'running' | 'paused' | 'error';
  lastExecutionTime?: number;
  executedActions: ExecutedAction[];
  errors: ExecutionError[];
}

export type ActionType = 'buy' | 'sell' | 'trigger' | 'condition';

export type ExecutedAction = {
  blockId: string;
  timestamp: number;
  type: ActionType;
  amount: number;
  price: number;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  pair?: string;
  errorMessage?: string;
}

export type ExecutionError = {
  timestamp: number;
  blockId?: string;
  message: string;
  code: string;
}

export interface BlockExecutor {
  execute(context: ExecutionContext): Promise<void>;
  validate(context: ExecutionContext): Promise<boolean>;
} 