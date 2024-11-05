import { 
  ExecutionContext, 
  BlockExecutor,
  ExecutionError,
  MarketData 
} from './types'
import { BlockType, BotStrategy } from '../types'
import { PriceTriggerExecutor, MarketBuyExecutor, MarketSellExecutor } from './block-executors'

export class ExecutionEngine {
  private executors: Map<string, BlockExecutor>
  private context: ExecutionContext
  private intervalId?: NodeJS.Timeout

  constructor(strategy: BotStrategy) {
    this.executors = new Map()
    this.context = {
      strategy,
      marketData: {
        price: 0,
        timestamp: 0,
        volume24h: 0,
        priceChange24h: 0
      },
      walletBalance: {},
      executionState: {
        status: 'idle',
        executedActions: [],
        errors: []
      }
    }

    // Register block executors
    this.registerExecutors()
  }

  private registerExecutors() {
    // Register different types of block executors
    this.executors.set('price-trigger', new PriceTriggerExecutor())
    this.executors.set('market-buy', new MarketBuyExecutor())
    this.executors.set('market-sell', new MarketSellExecutor())
  }

  private async updateMarketData(): Promise<void> {
    try {
      // TODO: Implement real market data fetching
      this.context.marketData = {
        price: Math.random() * 1000, // Mock price for now
        timestamp: Date.now(),
        volume24h: Math.random() * 1000000,
        priceChange24h: (Math.random() - 0.5) * 10
      }
    } catch (error) {
      this.addError({
        timestamp: Date.now(),
        message: 'Failed to update market data',
        code: 'MARKET_DATA_ERROR'
      })
    }
  }

  private addError(error: ExecutionError) {
    this.context.executionState.errors.push(error)
    if (this.context.executionState.errors.length > 100) {
      // Keep only last 100 errors
      this.context.executionState.errors = this.context.executionState.errors.slice(-100)
    }
  }

  private async executeBlock(block: BlockType): Promise<void> {
    const executor = this.executors.get(block.id)
    if (!executor) {
      this.addError({
        timestamp: Date.now(),
        blockId: block.id,
        message: `No executor found for block type: ${block.type}`,
        code: 'EXECUTOR_NOT_FOUND'
      })
      return
    }

    try {
      await executor.execute(this.context)
    } catch (error) {
      this.addError({
        timestamp: Date.now(),
        blockId: block.id,
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'EXECUTION_ERROR'
      })
    }
  }

  private async executeCycle(): Promise<void> {
    await this.updateMarketData()

    // Execute triggers first
    const triggers = this.context.strategy.blocks.filter(b => b.type === 'trigger')
    for (const trigger of triggers) {
      await this.executeBlock(trigger)
    }

    // Then execute connected actions
    const executedTriggers = this.context.executionState.executedActions
      .filter(a => a.timestamp > Date.now() - 5000) // Consider actions from last 5 seconds

    for (const trigger of executedTriggers) {
      const connections = this.context.strategy.connections
        .filter(c => c.sourceId === trigger.blockId)

      for (const connection of connections) {
        const actionBlock = this.context.strategy.blocks
          .find(b => b.id === connection.targetId)
        
        if (actionBlock) {
          await this.executeBlock(actionBlock)
        }
      }
    }
  }

  public async start(): Promise<void> {
    if (this.context.executionState.status === 'running') {
      return
    }

    this.context.executionState.status = 'running'
    this.intervalId = setInterval(() => this.executeCycle(), 1000)
  }

  public async stop(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    this.context.executionState.status = 'idle'
  }

  public async pause(): Promise<void> {
    this.context.executionState.status = 'paused'
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  public getExecutionState() {
    return this.context.executionState
  }

  public getMarketData() {
    return this.context.marketData
  }
} 