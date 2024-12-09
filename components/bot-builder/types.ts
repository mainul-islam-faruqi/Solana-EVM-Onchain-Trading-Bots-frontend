export interface Position {
  x: number;
  y: number;
}

export interface ValidationRule {
  type?: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  min?: number;
  max?: number;
  required?: boolean;
  value?: number | string | RegExp;
  message?: string;
  validate?: (value: unknown) => boolean;
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
  validationRules?: Record<string, ValidationRule>;
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

export interface ExecutionState {
  status: 'idle' | 'running' | 'paused' | 'error';
  errors?: string[];
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