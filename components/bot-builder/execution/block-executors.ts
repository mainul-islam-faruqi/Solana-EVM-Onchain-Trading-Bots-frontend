import { BlockExecutor, ExecutionContext, ActionType } from './types'

export class PriceTriggerExecutor implements BlockExecutor {
  async execute(context: ExecutionContext): Promise<void> {
    const { marketData, strategy } = context
    const triggerBlock = strategy.blocks.find(b => b.type === 'trigger')
    
    if (!triggerBlock) return

    const { price, condition, pair } = triggerBlock.config
    const currentPrice = marketData.price

    const triggered = this.evaluateCondition(currentPrice, price, condition)

    if (triggered) {
      context.executionState.executedActions.push({
        blockId: triggerBlock.id,
        timestamp: Date.now(),
        type: 'trigger' as ActionType,
        amount: 0,
        price: currentPrice,
        status: 'completed',
        pair
      })
    }
  }

  private evaluateCondition(currentPrice: number, targetPrice: number, condition: string): boolean {
    switch (condition) {
      case 'above':
        return currentPrice > targetPrice
      case 'below':
        return currentPrice < targetPrice
      case 'equals':
        // Use a small threshold for equality comparison
        const threshold = targetPrice * 0.001 // 0.1% threshold
        return Math.abs(currentPrice - targetPrice) <= threshold
      default:
        return false
    }
  }

  async validate(context: ExecutionContext): Promise<boolean> {
    // Validate price data availability
    return context.marketData.price > 0
  }
}

export class MarketOrderExecutor implements BlockExecutor {
  async execute(context: ExecutionContext): Promise<void> {
    const { marketData, strategy } = context
    const orderBlock = strategy.blocks.find(b => 
      b.type === 'action' && 
      b.config.type === 'market'
    )
    
    if (!orderBlock) return

    const { amount, side, slippage } = orderBlock.config
    const currentPrice = marketData.price

    // Calculate execution price with slippage
    const executionPrice = side === 'buy' 
      ? currentPrice * (1 + slippage / 100)
      : currentPrice * (1 - slippage / 100)

    try {
      const txHash = await this.submitMarketOrder(side, amount, executionPrice)

      context.executionState.executedActions.push({
        blockId: orderBlock.id,
        timestamp: Date.now(),
        type: side as ActionType,
        amount,
        price: executionPrice,
        status: 'completed',
        txHash
      })
    } catch (error) {
      context.executionState.executedActions.push({
        blockId: orderBlock.id,
        timestamp: Date.now(),
        type: side as ActionType,
        amount,
        price: executionPrice,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  private async submitMarketOrder(
    side: 'buy' | 'sell',
    amount: number,
    maxPrice: number
  ): Promise<string> {
    // Mock implementation - replace with actual blockchain transaction
    return '0x' + Math.random().toString(16).slice(2)
  }

  async validate(context: ExecutionContext): Promise<boolean> {
    const orderBlock = context.strategy.blocks.find(b => 
      b.type === 'action' && 
      b.config.type === 'market'
    )
    
    if (!orderBlock) return false

    // Check if we have sufficient balance for the trade
    const { amount, side } = orderBlock.config
    if (side === 'buy') {
      // Check if we have enough quote currency (e.g., USD)
      return this.hasQuoteBalance(context, amount * context.marketData.price)
    } else {
      // Check if we have enough base currency (e.g., BTC)
      return this.hasBaseBalance(context, amount)
    }
  }

  private hasQuoteBalance(context: ExecutionContext, required: number): boolean {
    // TODO: Implement actual balance check
    return true
  }

  private hasBaseBalance(context: ExecutionContext, required: number): boolean {
    // TODO: Implement actual balance check
    return true
  }
}

export class LimitOrderExecutor implements BlockExecutor {
  async execute(context: ExecutionContext): Promise<void> {
    const { marketData, strategy } = context
    const orderBlock = strategy.blocks.find(b => 
      b.type === 'action' && 
      b.config.type === 'limit'
    )
    
    if (!orderBlock) return

    const { amount, side, limitPrice, expiry } = orderBlock.config

    try {
      const txHash = await this.submitLimitOrder(side, amount, limitPrice, expiry)

      context.executionState.executedActions.push({
        blockId: orderBlock.id,
        timestamp: Date.now(),
        type: side as ActionType,
        amount,
        price: limitPrice,
        status: 'pending',
        txHash
      })
    } catch (error) {
      context.executionState.executedActions.push({
        blockId: orderBlock.id,
        timestamp: Date.now(),
        type: side as ActionType,
        amount,
        price: limitPrice,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  private async submitLimitOrder(
    side: 'buy' | 'sell',
    amount: number,
    limitPrice: number,
    expiry: string
  ): Promise<string> {
    // Mock implementation - replace with actual blockchain transaction
    return '0x' + Math.random().toString(16).slice(2)
  }

  async validate(context: ExecutionContext): Promise<boolean> {
    const orderBlock = context.strategy.blocks.find(b => 
      b.type === 'action' && 
      b.config.type === 'limit'
    )
    
    if (!orderBlock) return false

    const { amount, side, limitPrice } = orderBlock.config

    // Validate limit price
    if (side === 'buy' && limitPrice >= context.marketData.price) {
      return false // Buy limit price should be below market price
    }
    if (side === 'sell' && limitPrice <= context.marketData.price) {
      return false // Sell limit price should be above market price
    }

    // Check balances
    if (side === 'buy') {
      return this.hasQuoteBalance(context, amount * limitPrice)
    } else {
      return this.hasBaseBalance(context, amount)
    }
  }

  private hasQuoteBalance(context: ExecutionContext, required: number): boolean {
    // TODO: Implement actual balance check
    return true
  }

  private hasBaseBalance(context: ExecutionContext, required: number): boolean {
    // TODO: Implement actual balance check
    return true
  }
} 