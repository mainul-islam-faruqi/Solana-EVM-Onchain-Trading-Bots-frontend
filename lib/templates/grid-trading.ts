import { StrategyTemplate } from '@/types/templates';
import { createBlock } from '@/components/bot-builder/block-registry';

export const gridTradingTemplate: StrategyTemplate = {
  id: 'grid-trading-basic',
  name: 'Basic Grid Trading',
  description: 'Automated buy/sell orders at predetermined price intervals to profit from price oscillations',
  category: 'Grid Trading',
  difficulty: 'Beginner',
  strategy: {
    id: 'grid-trading-basic',
    name: 'Basic Grid Trading',
    blocks: [
      // Price Trigger Block
      {
        id: 'price-trigger-1',
        type: 'trigger',
        label: 'Upper Price Trigger',
        config: {
          price: 2000,
          condition: 'above'
        }
      },
      // Sell Action Block
      {
        id: 'sell-action-1',
        type: 'action',
        label: 'Sell Order',
        config: {
          action: 'sell',
          amount: 0.1,
          slippage: 0.5
        }
      },
      // Lower Price Trigger
      {
        id: 'price-trigger-2',
        type: 'trigger',
        label: 'Lower Price Trigger',
        config: {
          price: 1900,
          condition: 'below'
        }
      },
      // Buy Action Block
      {
        id: 'buy-action-1',
        type: 'action',
        label: 'Buy Order',
        config: {
          action: 'buy',
          amount: 0.1,
          slippage: 0.5
        }
      }
    ],
    connections: [
      {
        id: 'conn-1',
        sourceId: 'price-trigger-1',
        targetId: 'sell-action-1'
      },
      {
        id: 'conn-2',
        sourceId: 'price-trigger-2',
        targetId: 'buy-action-1'
      }
    ]
  },
  tags: ['Grid Trading', 'Automated', 'Beginner Friendly'],
  chainSupport: ['EVM', 'SOLANA'],
  createdAt: new Date(),
  updatedAt: new Date(),
  likes: 128,
  usageCount: 456,
  author: 'Trading Bot Team'
}; 