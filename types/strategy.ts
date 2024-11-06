export interface ValidationError {
  type: 'CYCLE_ERROR' | 'DANGLING_BLOCKS' | 'SEQUENCE_ERROR' | 'CONFIG_ERROR';
  message: string;
  blockId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface TestResult {
  timestamp: number;
  action: string;
  success: boolean;
  details: {
    price?: number;
    amount?: number;
    gas?: number;
    error?: string;
  };
} 