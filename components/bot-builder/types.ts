export type BlockType = {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  label: string;
  config: Record<string, any>;
  allowedConnections?: {
    inputs?: string[];
    outputs?: string[];
  };
  maxInputs?: number;
  maxOutputs?: number;
  chainType: 'solana' | 'evm' | 'both';
  category: 'price' | 'volume' | 'time' | 'trade' | 'logic';
  description: string;
  defaultConfig: Record<string, any>;
  validationRules?: {
    [key: string]: {
      min?: number;
      max?: number;
      required?: boolean;
      pattern?: RegExp;
      custom?: (value: any) => boolean;
    }
  };
}

export type TriggerType = {
  price: number;
  condition: 'above' | 'below' | 'equals';
  timeframe?: string;
  volume?: number;
  pair?: string;
}

export type ActionType = {
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  slippage?: number;
  chain: 'solana' | 'evm';
}

export type ConditionType = {
  type: 'and' | 'or';
  inputs: string[];
}

export interface PriceTriggerBlock extends BlockType {
  type: 'trigger';
  category: 'price';
  config: TriggerType;
}

export interface TradeActionBlock extends BlockType {
  type: 'action';
  category: 'trade';
  config: ActionType;
}

export interface LogicBlock extends BlockType {
  type: 'condition';
  category: 'logic';
  config: ConditionType;
}

export type Connection = {
  id: string;
  sourceId: string;
  targetId: string;
}

export type BotStrategy = {
  id: string;
  name: string;
  blocks: BlockType[];
  connections: Connection[];
}

export type Position = {
  x: number;
  y: number;
}

export type BlockPosition = {
  blockId: string;
  position: Position;
}

export type ValidationError = {
  type: 'connection' | 'configuration' | 'general';
  message: string;
  blockId?: string;
  connectionId?: string;
}

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
}

export interface DCAConfig {
  applicationIdx: number;
  inAmount: number;
  inAmountPerCycle: number;
  cycleFrequency: number;
  minOutAmount?: number;
  maxOutAmount?: number;
  startAt?: number;
  inputMint: string;   // Token pair: Input Token (e.g., USDC)
  outputMint: string;  // Token pair: Output Token (e.g., SOL)
}

export interface ExecutionState {
  status: 'idle' | 'running' | 'success' | 'error';
  lastUpdate: Date;
  errors: string[];
} 