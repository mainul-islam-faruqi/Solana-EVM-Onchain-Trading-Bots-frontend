export interface Position {
  x: number;
  y: number;
}

export interface BlockType {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'dca';
  category?: string;
  label: string;
  name?: string;
  description?: string;
  chainType?: string;
  config: Record<string, unknown>;
  defaultConfig?: Record<string, unknown>;
  validationRules?: Record<string, any>;
  allowedConnections?: Record<string, string[]>;
  maxInputs?: number;
  maxOutputs?: number;
}

export interface BotStrategy {
  id: string;
  name: string;
  blocks: BlockType[];
  connections: Array<{
    sourceId: string;
    targetId: string;
  }>;
}

export interface BlockPosition {
  blockId: string;
  position: Position;
}

export interface ValidationError {
  blockId: string;
  message: string;
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

export type ExecutionState = 'idle' | 'running' | 'paused' | 'error';