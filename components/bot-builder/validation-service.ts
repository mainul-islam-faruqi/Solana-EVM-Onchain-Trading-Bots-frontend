import { BlockType, BotStrategy, ValidationResult, ValidationError } from './types'
import { validateChainCompatibility, validateConnection } from './validation/chain-validator'

export class ValidationService {
  private validateBlockConnections(
    block: BlockType,
    strategy: BotStrategy,
    errors: ValidationError[]
  ): void {
    const incomingConnections = strategy.connections.filter(
      conn => conn.targetId === block.id
    )
    const outgoingConnections = strategy.connections.filter(
      conn => conn.sourceId === block.id
    )

    // Check max connections
    if (block.maxInputs !== undefined && incomingConnections.length > block.maxInputs) {
      errors.push({
        type: 'connection',
        message: `Block "${block.label}" exceeds maximum input connections (${block.maxInputs})`,
        blockId: block.id
      })
    }

    if (block.maxOutputs !== undefined && outgoingConnections.length > block.maxOutputs) {
      errors.push({
        type: 'connection',
        message: `Block "${block.label}" exceeds maximum output connections (${block.maxOutputs})`,
        blockId: block.id
      })
    }

    // Validate connection types and chain compatibility
    incomingConnections.forEach(conn => {
      const sourceBlock = strategy.blocks.find(b => b.id === conn.sourceId)
      if (sourceBlock) {
        // Validate allowed connection types
        if (block.allowedConnections?.inputs) {
          if (!block.allowedConnections.inputs.includes(sourceBlock.type)) {
            errors.push({
              type: 'connection',
              message: `Invalid connection: ${sourceBlock.label} cannot connect to ${block.label}`,
              connectionId: conn.id
            })
          }
        }

        // Validate chain compatibility
        const chainError = validateConnection(sourceBlock, block)
        if (chainError) {
          errors.push({
            ...chainError,
            connectionId: conn.id
          })
        }
      }
    })
  }

  private validateBlockConfiguration(
    block: BlockType,
    errors: ValidationError[]
  ): void {
    switch (block.type) {
      case 'trigger':
        if (block.config.price <= 0) {
          errors.push({
            type: 'configuration',
            message: `Invalid price in "${block.label}"`,
            blockId: block.id
          })
        }
        break
      
      case 'action':
        if (block.config.amount <= 0) {
          errors.push({
            type: 'configuration',
            message: `Invalid amount in "${block.label}"`,
            blockId: block.id
          })
        }
        break
    }
  }

  public validateStrategy(strategy: BotStrategy): ValidationResult {
    const errors: ValidationError[] = []

    // Check chain compatibility across all connections
    const chainErrors = validateChainCompatibility(strategy.blocks, strategy.connections)
    errors.push(...chainErrors)

    // Check if strategy has at least one trigger and one action
    const hasTrigger = strategy.blocks.some(block => block.type === 'trigger')
    const hasAction = strategy.blocks.some(block => block.type === 'action')

    if (!hasTrigger) {
      errors.push({
        type: 'general',
        message: 'Strategy must have at least one trigger'
      })
    }

    if (!hasAction) {
      errors.push({
        type: 'general',
        message: 'Strategy must have at least one action'
      })
    }

    // Validate each block
    strategy.blocks.forEach(block => {
      this.validateBlockConnections(block, strategy, errors)
      this.validateBlockConfiguration(block, errors)
    })

    // Check for cycles in connections
    if (this.hasCycle(strategy)) {
      errors.push({
        type: 'general',
        message: 'Strategy contains circular dependencies'
      })
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  private hasCycle(strategy: BotStrategy): boolean {
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const dfs = (blockId: string): boolean => {
      visited.add(blockId)
      recursionStack.add(blockId)

      const outgoingConnections = strategy.connections.filter(
        conn => conn.sourceId === blockId
      )

      for (const conn of outgoingConnections) {
        if (!visited.has(conn.targetId)) {
          if (dfs(conn.targetId)) {
            return true
          }
        } else if (recursionStack.has(conn.targetId)) {
          return true
        }
      }

      recursionStack.delete(blockId)
      return false
    }

    for (const block of strategy.blocks) {
      if (!visited.has(block.id)) {
        if (dfs(block.id)) {
          return true
        }
      }
    }

    return false
  }
} 