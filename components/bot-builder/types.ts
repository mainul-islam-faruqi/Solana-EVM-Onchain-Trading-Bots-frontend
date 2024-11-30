export type BlockType = {
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