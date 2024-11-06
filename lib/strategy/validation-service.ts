import { BotStrategy } from '@/components/bot-builder/types';
import { ValidationError, ValidationResult } from '@/types/strategy';

export class ValidationService {
  validateStrategy(strategy: BotStrategy): ValidationResult {
    const errors: ValidationError[] = [];

    // Check for cycles
    if (this.hasCycles(strategy)) {
      errors.push({
        type: 'CYCLE_ERROR',
        message: 'Strategy contains cycles which may cause infinite loops'
      });
    }

    // Check for dangling blocks
    const danglingBlocks = this.findDanglingBlocks(strategy);
    if (danglingBlocks.length > 0) {
      errors.push({
        type: 'DANGLING_BLOCKS',
        message: `Found ${danglingBlocks.length} unconnected blocks`,
        blockId: danglingBlocks[0]
      });
    }

    // Validate block sequence
    const sequenceErrors = this.validateBlockSequence(strategy);
    errors.push(...sequenceErrors);

    // Validate block configurations
    const configErrors = this.validateBlockConfigs(strategy);
    errors.push(...configErrors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private hasCycles(strategy: BotStrategy): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCyclesDFS = (blockId: string): boolean => {
      if (recursionStack.has(blockId)) return true;
      if (visited.has(blockId)) return false;

      visited.add(blockId);
      recursionStack.add(blockId);

      const connections = strategy.connections.filter(c => c.sourceId === blockId);
      for (const conn of connections) {
        if (hasCyclesDFS(conn.targetId)) return true;
      }

      recursionStack.delete(blockId);
      return false;
    };

    for (const block of strategy.blocks) {
      if (hasCyclesDFS(block.id)) return true;
    }

    return false;
  }

  private findDanglingBlocks(strategy: BotStrategy): string[] {
    const connectedBlocks = new Set<string>();
    
    strategy.connections.forEach(conn => {
      connectedBlocks.add(conn.sourceId);
      connectedBlocks.add(conn.targetId);
    });

    return strategy.blocks
      .filter(block => !connectedBlocks.has(block.id))
      .map(block => block.id);
  }

  private validateBlockSequence(strategy: BotStrategy): ValidationError[] {
    const errors: ValidationError[] = [];
    const entryPoints = strategy.blocks.filter(b => b.type === 'ENTRY');

    if (entryPoints.length === 0) {
      errors.push({
        type: 'SEQUENCE_ERROR',
        message: 'Strategy must have at least one entry point'
      });
    }

    if (entryPoints.length > 1) {
      errors.push({
        type: 'SEQUENCE_ERROR',
        message: 'Strategy cannot have multiple entry points'
      });
    }

    return errors;
  }

  private validateBlockConfigs(strategy: BotStrategy): ValidationError[] {
    const errors: ValidationError[] = [];

    strategy.blocks.forEach(block => {
      if (!block.config) {
        errors.push({
          type: 'CONFIG_ERROR',
          message: `Block ${block.label} is missing configuration`,
          blockId: block.id
        });
        return;
      }

      // Validate required fields based on block type
      switch (block.type) {
        case 'PRICE_TRIGGER':
          if (!block.config.price || !block.config.condition) {
            errors.push({
              type: 'CONFIG_ERROR',
              message: `Price trigger block requires price and condition`,
              blockId: block.id
            });
          }
          break;
        case 'TRADE':
          if (!block.config.amount || !block.config.tokenAddress) {
            errors.push({
              type: 'CONFIG_ERROR',
              message: `Trade block requires amount and token address`,
              blockId: block.id
            });
          }
          break;
      }
    });

    return errors;
  }
} 