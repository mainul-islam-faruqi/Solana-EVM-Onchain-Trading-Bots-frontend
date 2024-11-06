import { BotStrategy } from './strategy';

export type StrategyCategory = 'Grid Trading' | 'DCA' | 'Arbitrage' | 'Trend Following' | 'Custom';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  category: StrategyCategory;
  difficulty: DifficultyLevel;
  strategy: BotStrategy;
  tags: string[];
  author?: string;
  createdAt: Date;
  updatedAt: Date;
  likes?: number;
  usageCount?: number;
  chainSupport: ('EVM' | 'SOLANA')[];
}

export interface TemplateFilters {
  category?: StrategyCategory;
  difficulty?: DifficultyLevel;
  chain?: 'EVM' | 'SOLANA';
  searchQuery?: string;
  tags?: string[];
} 