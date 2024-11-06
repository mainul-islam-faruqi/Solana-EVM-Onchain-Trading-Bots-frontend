import { StrategyTemplate } from '@/types/templates';

export const PRESET_TEMPLATES: StrategyTemplate[] = [
  {
    id: 'grid-trading-basic',
    name: 'Basic Grid Trading',
    description: 'Simple grid trading strategy that places buy and sell orders at regular price intervals',
    category: 'Grid Trading',
    difficulty: 'Beginner',
    strategy: {
      id: 'grid-trading-basic',
      name: 'Basic Grid Trading',
      blocks: [
        // Add predefined blocks for grid trading
      ],
      connections: [
        // Add connections between blocks
      ]
    },
    tags: ['Grid Trading', 'Automated', 'Beginner Friendly'],
    chainSupport: ['EVM', 'SOLANA'],
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: 128,
    usageCount: 456
  },
  // Add more templates
]; 