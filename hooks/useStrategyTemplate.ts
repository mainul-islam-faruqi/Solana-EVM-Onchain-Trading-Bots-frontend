import { useState, useCallback } from 'react';
import { StrategyTemplate } from '@/types/templates';
import { BotStrategy, BlockPosition } from '@/components/bot-builder/types';
import { TemplateService } from '@/lib/services/template-service';

export function useStrategyTemplate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const templateService = new TemplateService();

  const loadTemplate = useCallback(async (templateId: string): Promise<{
    strategy: BotStrategy;
    positions: BlockPosition[];
  } | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const template = await templateService.getTemplateById(templateId);
      if (!template) {
        setError('Template not found');
        return null;
      }

      // Calculate optimal block positions
      const positions = calculateBlockPositions(template.strategy);

      return {
        strategy: template.strategy,
        positions
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load template');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper function to calculate optimal block positions
  const calculateBlockPositions = (strategy: BotStrategy): BlockPosition[] => {
    const GRID_COLS = 3;
    const BLOCK_SPACING_X = 300;
    const BLOCK_SPACING_Y = 200;
    const INITIAL_OFFSET = { x: 100, y: 100 };

    return strategy.blocks.map((block, index) => ({
      blockId: block.id,
      position: {
        x: INITIAL_OFFSET.x + (index % GRID_COLS) * BLOCK_SPACING_X,
        y: INITIAL_OFFSET.y + Math.floor(index / GRID_COLS) * BLOCK_SPACING_Y
      }
    }));
  };

  return {
    loadTemplate,
    isLoading,
    error
  };
} 