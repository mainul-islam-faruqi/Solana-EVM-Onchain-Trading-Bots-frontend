import { BlockType } from '../types'

export interface ChainValidationError {
  type: 'configuration';
  message: string;
  blockId: string;
}

export function validateChainCompatibility(blocks: BlockType[], connections: { sourceId: string; targetId: string }[]): ChainValidationError[] {
  const errors: ChainValidationError[] = []
  
  // Check each connection for chain compatibility
  connections.forEach(connection => {
    const sourceBlock = blocks.find(b => b.id === connection.sourceId)
    const targetBlock = blocks.find(b => b.id === connection.targetId)
    
    if (sourceBlock && targetBlock) {
      // Skip validation if either block supports both chains
      if (sourceBlock.chainType !== 'both' && targetBlock.chainType !== 'both') {
        // Check if blocks are on different chains
        if (sourceBlock.chainType !== targetBlock.chainType) {
          errors.push({
            type: 'configuration',
            message: `Chain incompatibility: ${sourceBlock.label} (${sourceBlock.chainType}) cannot connect to ${targetBlock.label} (${targetBlock.chainType})`,
            blockId: sourceBlock.id
          })
        }
      }
    }
  })
  
  return errors
}

// Helper function to validate a single connection
export function validateConnection(sourceBlock: BlockType, targetBlock: BlockType): ChainValidationError | null {
  // Skip validation if either block supports both chains
  if (sourceBlock.chainType === 'both' || targetBlock.chainType === 'both') {
    return null
  }

  // Check if blocks are on different chains
  if (sourceBlock.chainType !== targetBlock.chainType) {
    return {
      type: 'configuration',
      message: `Chain incompatibility: ${sourceBlock.label} (${sourceBlock.chainType}) cannot connect to ${targetBlock.label} (${targetBlock.chainType})`,
      blockId: sourceBlock.id
    }
  }

  return null
}

// Helper function to check if a block is compatible with a chain
export function isChainCompatible(block: BlockType, chain: 'solana' | 'evm'): boolean {
  return block.chainType === 'both' || block.chainType === chain
} 