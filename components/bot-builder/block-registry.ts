import { BlockType, PriceTriggerBlock, TradeActionBlock, LogicBlock } from './types'
import { TOKEN_MINTS } from '@/lib/solana/constants';

// Define available DCA pairs
const DCA_PAIRS = [
  {
    id: 'USDC-SOL',
    name: 'USDC/SOL',
    inputToken: {
      symbol: 'USDC',
      mint: TOKEN_MINTS.USDC,
    },
    outputToken: {
      symbol: 'SOL',
      mint: TOKEN_MINTS.SOL,
    }
  },
  {
    id: 'USDT-SOL',
    name: 'USDT/SOL',
    inputToken: {
      symbol: 'USDT',
      mint: TOKEN_MINTS.USDT,
    },
    outputToken: {
      symbol: 'SOL',
      mint: TOKEN_MINTS.SOL,
    }
  },
  {
    id: 'SOL-USDC',
    name: 'SOL/USDC', 
    inputToken: {
      symbol: 'SOL',
      mint: TOKEN_MINTS.SOL,
    },
    outputToken: {
      symbol: 'USDC',
      mint: TOKEN_MINTS.USDC,
    }
  },
  {
    id: 'USDC-BONK',
    name: 'USDC/BONK',
    inputToken: {
      symbol: 'USDC', 
      mint: TOKEN_MINTS.USDC,
    },
    outputToken: {
      symbol: 'BONK',
      mint: TOKEN_MINTS.BONK,
    }
  },
  {
    id: 'USDT-BONK',
    name: 'USDT/BONK',
    inputToken: {
      symbol: 'USDT',
      mint: TOKEN_MINTS.USDT, 
    },
    outputToken: {
      symbol: 'BONK',
      mint: TOKEN_MINTS.BONK,
    }
  },
  {
    id: 'BONK-SOL',
    name: 'BONK/SOL',
    inputToken: {
      symbol: 'BONK',
      mint: TOKEN_MINTS.BONK,
    },
    outputToken: {
      symbol: 'SOL', 
      mint: TOKEN_MINTS.SOL,
    }
  }
];

export const AVAILABLE_BLOCKS: BlockType[] = [
  {
    id: 'price-trigger',
    type: 'trigger',
    category: 'price',
    label: 'Price Trigger',
    description: 'Triggers when price meets specified condition',
    chainType: 'both',
    config: {
      price: 0,
      condition: 'above',
      pair: 'BTC/USD'
    },
    defaultConfig: {
      price: 0,
      condition: 'above',
      pair: 'BTC/USD'
    },
    validationRules: {
      price: { min: 0, required: true },
      condition: { required: true },
      pair: { required: true }
    },
    allowedConnections: {
      outputs: ['action', 'condition']
    },
    maxOutputs: 1
  },
  {
    id: 'volume-trigger',
    type: 'trigger',
    category: 'volume',
    label: 'Volume Trigger',
    description: 'Triggers based on trading volume conditions',
    chainType: 'both',
    config: {
      volume: 0,
      timeframe: '1h',
      condition: 'above',
      pair: 'BTC/USD'
    },
    defaultConfig: {
      volume: 0,
      timeframe: '1h',
      condition: 'above',
      pair: 'BTC/USD'
    },
    validationRules: {
      volume: { min: 0, required: true },
      timeframe: { required: true }
    },
    allowedConnections: {
      outputs: ['action', 'condition']
    },
    maxOutputs: 1
  },
  {
    id: 'time-trigger',
    type: 'trigger',
    category: 'time',
    label: 'Time Trigger',
    description: 'Triggers at specified time intervals',
    chainType: 'both',
    config: {
      interval: '1h',
      startTime: null,
      endTime: null,
      daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri']
    },
    defaultConfig: {
      interval: '1h',
      startTime: null,
      endTime: null,
      daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri']
    },
    validationRules: {
      interval: { required: true }
    },
    allowedConnections: {
      outputs: ['action', 'condition']
    },
    maxOutputs: 1
  },
  {
    id: 'market-buy',
    type: 'action',
    category: 'trade',
    label: 'Market Buy',
    description: 'Execute a market buy order',
    chainType: 'both',
    config: {
      type: 'market',
      side: 'buy',
      amount: 0,
      slippage: 1
    },
    defaultConfig: {
      type: 'market',
      side: 'buy',
      amount: 0,
      slippage: 1
    },
    validationRules: {
      amount: { min: 0, required: true },
      slippage: { min: 0, max: 100 }
    },
    allowedConnections: {
      inputs: ['trigger', 'condition']
    },
    maxInputs: 1
  },
  {
    id: 'limit-buy',
    type: 'action',
    category: 'trade',
    label: 'Limit Buy',
    description: 'Place a limit buy order',
    chainType: 'both',
    config: {
      type: 'limit',
      side: 'buy',
      amount: 0,
      limitPrice: 0,
      expiry: '24h'
    },
    defaultConfig: {
      type: 'limit',
      side: 'buy',
      amount: 0,
      limitPrice: 0,
      expiry: '24h'
    },
    validationRules: {
      amount: { min: 0, required: true },
      limitPrice: { min: 0, required: true }
    },
    allowedConnections: {
      inputs: ['trigger', 'condition']
    },
    maxInputs: 1
  },
  {
    id: 'stop-loss',
    type: 'action',
    category: 'trade',
    label: 'Stop Loss',
    description: 'Place a stop-loss order',
    chainType: 'both',
    config: {
      type: 'stop',
      stopPrice: 0,
      amount: 0,
      slippage: 1
    },
    defaultConfig: {
      type: 'stop',
      stopPrice: 0,
      amount: 0,
      slippage: 1
    },
    validationRules: {
      stopPrice: { min: 0, required: true },
      amount: { min: 0, required: true }
    },
    allowedConnections: {
      inputs: ['trigger', 'condition']
    },
    maxInputs: 1
  },
  {
    id: 'and-condition',
    type: 'condition',
    category: 'logic',
    label: 'AND Gate',
    description: 'Combines multiple conditions with AND logic',
    chainType: 'both',
    config: {
      type: 'and',
      inputs: []
    },
    defaultConfig: {
      type: 'and',
      inputs: []
    },
    allowedConnections: {
      inputs: ['trigger', 'condition'],
      outputs: ['action']
    },
    maxInputs: 5,
    maxOutputs: 1
  },
  {
    id: 'or-condition',
    type: 'condition',
    category: 'logic',
    label: 'OR Gate',
    description: 'Combines multiple conditions with OR logic',
    chainType: 'both',
    config: {
      type: 'or',
      inputs: []
    },
    defaultConfig: {
      type: 'or',
      inputs: []
    },
    allowedConnections: {
      inputs: ['trigger', 'condition'],
      outputs: ['action']
    },
    maxInputs: 5,
    maxOutputs: 1
  },
  {
    id: 'delay-condition',
    type: 'condition',
    category: 'logic',
    label: 'Delay',
    description: 'Adds a time delay before executing the next action',
    chainType: 'both',
    config: {
      delay: '5m',
      cancelOnNewTrigger: false
    },
    defaultConfig: {
      delay: '5m',
      cancelOnNewTrigger: false
    },
    validationRules: {
      delay: { required: true }
    },
    allowedConnections: {
      inputs: ['trigger', 'condition'],
      outputs: ['action']
    },
    maxInputs: 1,
    maxOutputs: 1
  },
  {
    id: 'market-sell',
    type: 'action',
    category: 'trade',
    label: 'Market Sell',
    description: 'Execute a market sell order',
    chainType: 'both',
    config: {
      type: 'market',
      side: 'sell',
      amount: 0,
      slippage: 1
    },
    defaultConfig: {
      type: 'market',
      side: 'sell',
      amount: 0,
      slippage: 1
    },
    validationRules: {
      amount: { min: 0, required: true },
      slippage: { min: 0, max: 100 }
    },
    allowedConnections: {
      inputs: ['trigger', 'condition']
    },
    maxInputs: 1
  },
  {
    id: 'limit-sell',
    type: 'action',
    category: 'trade',
    label: 'Limit Sell',
    description: 'Place a limit sell order',
    chainType: 'both',
    config: {
      type: 'limit',
      side: 'sell',
      amount: 0,
      limitPrice: 0,
      expiry: '24h'
    },
    defaultConfig: {
      type: 'limit',
      side: 'sell',
      amount: 0,
      limitPrice: 0,
      expiry: '24h'
    },
    validationRules: {
      amount: { min: 0, required: true },
      limitPrice: { min: 0, required: true }
    },
    allowedConnections: {
      inputs: ['trigger', 'condition']
    },
    maxInputs: 1
  },
  {
    id: 'take-profit',
    type: 'action',
    category: 'trade',
    label: 'Take Profit',
    description: 'Place a take-profit sell order',
    chainType: 'both',
    config: {
      type: 'limit',
      side: 'sell',
      amount: 0,
      targetPrice: 0,
      trailingPercent: 0
    },
    defaultConfig: {
      type: 'limit',
      side: 'sell',
      amount: 0,
      targetPrice: 0,
      trailingPercent: 0
    },
    validationRules: {
      amount: { min: 0, required: true },
      targetPrice: { min: 0, required: true },
      trailingPercent: { min: 0, max: 100 }
    },
    allowedConnections: {
      inputs: ['trigger', 'condition']
    },
    maxInputs: 1
  },
  {
    id: 'dca',
    type: 'dca',
    label: 'DCA Strategy',
    name: 'Dollar Cost Averaging',
    config: {
      tradingPair: '',
      inputAmount: 0,
      cycleFrequency: 3600,
      minOutAmount: 0,
      maxOutAmount: 0,
      availablePairs: DCA_PAIRS
    },
    defaultConfig: {
      tradingPair: '',
      inputAmount: 0,
      cycleFrequency: 3600,
      minOutAmount: 0,
      maxOutAmount: 0,
      availablePairs: DCA_PAIRS
    },
    validationRules: {
      tradingPair: { required: true },
      inputAmount: { required: true, min: 0 },
      cycleFrequency: { required: true, min: 60 },
    }
  }
]

export function getBlockTemplate(type: string): BlockType | undefined {
  return AVAILABLE_BLOCKS.find(block => block.id === type)
}

export function createBlock(type: string): BlockType | undefined {
  const template = getBlockTemplate(type)
  if (!template) return undefined

  return {
    ...template,
    id: crypto.randomUUID(),
    config: { ...template.defaultConfig }
  }
}

// Export DCA pairs for use in other components
export { DCA_PAIRS }; 