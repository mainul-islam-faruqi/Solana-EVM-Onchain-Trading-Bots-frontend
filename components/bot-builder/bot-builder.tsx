'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockType, BotStrategy, BlockPosition, Position } from './types'
import { ConnectionLine } from './connection-line'
import { BlockLibrary } from './block-library'
import { Block } from './block'
import { ValidationService } from '@/lib/strategy/validation-service'
import { ValidationError } from './types'
import { ExecutionPanel } from './execution/execution-panel'
import { AlertCircle } from 'lucide-react'
import { AVAILABLE_BLOCKS, createBlock } from './block-registry'
import { StrategyTester } from './testing/strategy-tester'
import { StrategyTemplate } from '@/types/templates'
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useStrategyTemplate } from '@/hooks/useStrategyTemplate';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PriceMonitoringPanel } from './price-monitoring/price-panel';
import { AssetManagement } from '@/components/wallet/asset-management';
import { TokenSelector } from '@/components/bot-builder/token-selector';
import { DCAConfig, ExecutionState } from './types';
import { PublicKey } from '@solana/web3.js';
import { AVAILABLE_PAIRS, TokenInfo } from '@/lib/constants/token-pairs';
import { Zap, DollarSign, Blocks, Settings } from 'lucide-react';
import { BlockConfigSummary } from './block-config-summary';

export function BotBuilder() {
  const [strategy, setStrategy] = React.useState<BotStrategy>({
    id: crypto.randomUUID(),
    name: 'New Strategy',
    blocks: [],
    connections: []
  })


  const [availableBlocks] = React.useState<BlockType[]>(AVAILABLE_BLOCKS)

  const [selectedBlock, setSelectedBlock] = React.useState<BlockType | null>(null)
  const [connecting, setConnecting] = React.useState<{ sourceId: string } | null>(null)
  const blockRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())

  const [blockPositions, setBlockPositions] = React.useState<BlockPosition[]>([])

  // Load positions from local storage on mount
  React.useEffect(() => {
    const savedPositions = localStorage.getItem('blockPositions')
    if (savedPositions) {
      setBlockPositions(JSON.parse(savedPositions))
    }
  }, [])

  // Save positions to local storage whenever they change
  React.useEffect(() => {
    localStorage.setItem('blockPositions', JSON.stringify(blockPositions))
  }, [blockPositions])

  const [previewConnection, setPreviewConnection] = React.useState<{
    start: Position;
    end: Position;
  } | null>(null)

  const [validationErrors, setValidationErrors] = React.useState<ValidationError[]>([])
  const validationService = React.useMemo(() => new ValidationService(), [])

  const { loadTemplate, isLoading: isTemplateLoading } = useStrategyTemplate();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [executionStatus, setExecutionStatus] = React.useState<'idle' | 'running' | 'paused' | 'error'>('idle');

  const blockLibraryRef = React.useRef<HTMLDivElement>(null);
  const [blockLibraryHeight, setBlockLibraryHeight] = React.useState<number>(0);

  const [selectedToken, setSelectedToken] = React.useState<string | null>(null);

  const [dcaConfig, setDcaConfig] = React.useState<DCAConfig>({
    applicationIdx: 0,
    inAmount: 0,
    inAmountPerCycle: 0,
    cycleFrequency: 3600, // 1 hour default
    minOutAmount: undefined,
    maxOutAmount: undefined,
    startAt: undefined,
    inputMint: '',   // Add inputMint
    outputMint: ''   // Add outputMint
  });

  // Update block library height on mount and resize
  React.useEffect(() => {
    const updateHeight = () => {
      if (blockLibraryRef.current) {
        const height = blockLibraryRef.current.offsetHeight;
        setBlockLibraryHeight(height);
      }
    };

    // Initial measurement
    updateHeight();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateHeight);
    if (blockLibraryRef.current) {
      resizeObserver.observe(blockLibraryRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Handle template loading
  React.useEffect(() => {
    const loadTemplateFromUrl = async () => {
      const templateId = searchParams.get('template');
      if (!templateId) return;

      try {
        const result = await loadTemplate(templateId);
        if (result) {
          // Set strategy and positions
          setStrategy(result.strategy);
          setBlockPositions(result.positions);
          setSelectedBlock(null);
          
          // Show success message
          toast({
            title: "Template Loaded",
            description: "Strategy template has been loaded successfully.",
            variant: "success",
          });

          // Set preview mode
          setIsTemplatePreview(true);
        }
      } catch (error) {
        console.error('Failed to load template:', error);
        toast({
          title: "Error",
          description: "Failed to load template. Please try again.",
          variant: "error",
        });
      }
    };

    loadTemplateFromUrl();
  }, [searchParams, loadTemplate, toast]);

  // Add template preview banner
  const [isTemplatePreview, setIsTemplatePreview] = React.useState(false);
  React.useEffect(() => {
    setIsTemplatePreview(!!searchParams.get('template'));
  }, [searchParams]);

  const handleResetStrategy = () => {
    setStrategy({
      id: crypto.randomUUID(),
      name: 'New Strategy',
      blocks: [],
      connections: []
    });
    setBlockPositions([]);
    setSelectedBlock(null);
    router.push('/bot-builder'); // Remove template from URL
  };

  const handleConfirmTemplate = () => {
    setIsTemplatePreview(false);
    toast({
      title: "Template Applied",
      description: "You can now customize the strategy.",
      variant: "success",
    });
  };

  const validateStrategy = React.useCallback(() => {
    const result = validationService.validateStrategy(strategy)
    setValidationErrors(result.errors)
    return result.isValid
  }, [strategy, validationService])

  const handleDragStart = (e: React.DragEvent, block: BlockType) => {
    e.dataTransfer.setData('blockType', block.id)
  }

  const handleBlockDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const blockType = e.dataTransfer.getData('blockType')
    const newBlock = createBlock(blockType)
    
    if (newBlock) {
      const canvas = document.querySelector('.strategy-canvas')
      if (!canvas) return

      const canvasRect = canvas.getBoundingClientRect()
      
      // Calculate initial position relative to canvas
      const estimatedBlockWidth = 200
      const estimatedBlockHeight = 150
      const padding = 10

      // Calculate raw position
      let x = e.clientX - canvasRect.left
      let y = e.clientY - canvasRect.top

      // Apply canvas boundaries
      const minX = padding
      const maxX = canvasRect.width - estimatedBlockWidth - padding
      const minY = padding
      const maxY = canvasRect.height - estimatedBlockHeight - padding

      // Clamp position within canvas
      x = Math.max(minX, Math.min(maxX, x))
      y = Math.max(minY, Math.min(maxY, y))

      // Add the new block
      setStrategy(prev => ({
        ...prev,
        blocks: [...prev.blocks, newBlock]
      }))

      // Set its position
      setBlockPositions(prev => [
        ...prev,
        {
          blockId: newBlock.id,
          position: { x, y }
        }
      ])

      // Select the new block
      setSelectedBlock(newBlock)
    }
  }

  const handleBlockDrag = (blockId: string, x: number, y: number) => {
    const canvas = document.querySelector('.strategy-canvas')
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    const estimatedBlockWidth = 200
    const estimatedBlockHeight = 150
    const padding = 10

    // Apply canvas boundaries
    const minX = padding
    const maxX = canvasRect.width - estimatedBlockWidth - padding
    const minY = padding
    const maxY = canvasRect.height - estimatedBlockHeight - padding

    // Clamp position within canvas
    x = Math.max(minX, Math.min(maxX, x))
    y = Math.max(minY, Math.min(maxY, y))

    // Update block position
    setBlockPositions(prev => {
      const newPositions = prev.map(pos => 
        pos.blockId === blockId 
          ? { ...pos, position: { x, y } }
          : pos
      )
      
      // If this block doesn't have a position yet, add it
      if (!prev.some(pos => pos.blockId === blockId)) {
        newPositions.push({ blockId, position: { x, y } })
      }
      
      return newPositions
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleBlockClick = (block: BlockType) => {
    setSelectedBlock(block)
  }

  const handleConfigChange = (blockId: string, newConfig: Record<string, unknown>) => {
    // Update strategy blocks only
    setStrategy(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId ? { ...block, config: newConfig } : block
      )
    }));
  }

  // Sync selectedBlock with strategy updates
  React.useEffect(() => {
    if (selectedBlock) {
      const updatedBlock = strategy.blocks.find(block => block.id === selectedBlock.id);
      if (updatedBlock && JSON.stringify(updatedBlock.config) !== JSON.stringify(selectedBlock.config)) {
        setSelectedBlock(updatedBlock);
      }
    }
  }, [strategy.blocks, selectedBlock]);

  const handleBlockRemove = (blockId: string) => {
    // Remove the block
    setStrategy(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId),
      // Also remove any connections involving this block
      connections: prev.connections.filter(
        conn => conn.sourceId !== blockId && conn.targetId !== blockId
      )
    }))

    // Remove block position
    setBlockPositions(prev => prev.filter(bp => bp.blockId !== blockId))

    // Clear block ref
    blockRefs.current.delete(blockId)

    // Deselect if this was the selected block
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null)
    }
  }

  const handleConnectionStart = (blockId: string) => {
    setConnecting({ sourceId: blockId })
  }

  const handleConnectionEnd = () => {
    setConnecting(null)
    setPreviewConnection(null)
  }

  const getBlockCenter = (element: HTMLDivElement | undefined) => {
    if (!element) return { x: 0, y: 0 };
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (connecting) {
      const sourceElement = blockRefs.current.get(connecting.sourceId);
      if (!sourceElement) return;

      const rect = e.currentTarget.getBoundingClientRect();
      setPreviewConnection({
        start: getBlockCenter(sourceElement),
        end: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
      });
    }
  }

  const handleStartExecution = async () => {
    const validationResult = validationService.validateStrategy(strategy);
    if (!validationResult.isValid) {
      setValidationErrors(validationResult.errors);
      return;
    }
    
    // Continue with execution
  };

  const handleTemplateSelect = (template: StrategyTemplate) => {
    // Load template strategy
    setStrategy(template.strategy);
    
    // Calculate block positions
    const newPositions: BlockPosition[] = template.strategy.blocks.map((block, index) => ({
      blockId: block.id,
      position: {
        x: 200 + (index % 2) * 300, // Arrange blocks in a grid
        y: 150 + Math.floor(index / 2) * 200
      }
    }));
    
    setBlockPositions(newPositions);
    
    // Reset selected block
    setSelectedBlock(null);
  };

  const handleTokenSelect = (inputToken: TokenInfo, outputToken: TokenInfo) => {
    setDcaConfig(prev => ({
      ...prev,
      inputMint: inputToken.mint.toString(),
      outputMint: outputToken.mint.toString()
    }));
  };

  const handleExecutionStateChange = (state: ExecutionState) => {
    setExecutionStatus(state.status as 'error' | 'idle' | 'running' | 'paused');
    if (state.errors.length > 0) {
      setValidationErrors(state.errors.map(error => ({
        type: 'general',
        message: error
      })));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkest to-dark">
      <div className="container mx-auto px-4 py-12">
        {/* Add status indicator */}
        {executionStatus !== 'idle' && (
          <div className={cn(
            "fixed bottom-4 right-4 p-4 rounded-lg shadow-lg",
            "border backdrop-blur-sm",
            executionStatus === 'running' && "border-success/20 bg-success/10",
            executionStatus === 'paused' && "border-warning/20 bg-warning/10",
            executionStatus === 'error' && "border-error/20 bg-error/10"
          )}>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                executionStatus === 'running' && "bg-success",
                executionStatus === 'paused' && "bg-warning",
                executionStatus === 'error' && "bg-error"
              )} />
              <span className={cn(
                "text-sm font-medium",
                executionStatus === 'running' && "text-success",
                executionStatus === 'paused' && "text-warning",
                executionStatus === 'error' && "text-error"
              )}>
                {executionStatus.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Template Preview Banner */}
          {isTemplatePreview && (
            <div className="bg-darker/30 border border-accent/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-lightest">
                    Template Preview: {strategy.name}
                  </h2>
                  <p className="text-sm text-lighter/70">
                    Review the template strategy before customizing
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleResetStrategy}
                    className="border-accent/20 text-light"
                  >
                    Start Fresh
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleConfirmTemplate}
                    className="bg-accent text-white"
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isTemplateLoading && (
            <div className="flex items-center justify-center p-12">
              <div className="space-y-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                <p className="text-lighter">Loading template...</p>
              </div>
            </div>
          )}

          {/* Strategy Builder Section */}
          <div className="grid grid-cols-12 gap-6">
            {/* Block Library */}
            <div className="lg:col-span-3" ref={blockLibraryRef}>
              <div className="space-y-6">
                <BlockLibrary
                  blocks={availableBlocks}
                  onDragStart={handleDragStart}
                />
                {/* Add Asset Management below Block Library */}
                <AssetManagement />
              </div>
            </div>

            {/* Canvas */}
            <div className="lg:col-span-9">
              <Card 
                className={cn(
                  "border border-accent/20 bg-darker/50 backdrop-blur-sm",
                  "relative transition-all duration-200",
                  "strategy-canvas overflow-hidden"
                )}
                style={{ height: blockLibraryHeight ? `${blockLibraryHeight}px` : '600px' }}
                onDrop={handleBlockDrop}
                onDragOver={handleDragOver}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setPreviewConnection(null)}
              >
                <CardHeader className="border-b border-accent/20">
                  <CardTitle className="text-lg font-medium text-lightest">Strategy Canvas</CardTitle>
                </CardHeader>
                <CardContent className="relative h-full">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-darker/5 via-darker/10 to-darker/20" />

                  {/* Empty state */}
                  {strategy.blocks.length === 0 && (
                    <div className="absolute left-0 right-0 flex justify-center text-lightest z-10 mt-8">
                      <div className="text-center">
                        <div className="inline-block p-3 rounded-full bg-darker/50 mb-4">
                          <AlertCircle className="w-6 h-6 text-lighter" />
                        </div>
                        <p className="text-sm text-lighter">Drag blocks from the library to start building your strategy</p>
                      </div>
                    </div>
                  )}

                  {/* Connections */}
                  <svg className="absolute inset-0 pointer-events-none">
                    {strategy.connections.map(connection => {
                      const sourceEl = blockRefs.current.get(connection.sourceId)
                      const targetEl = blockRefs.current.get(connection.targetId)
                      if (sourceEl && targetEl) {
                        return (
                          <ConnectionLine
                            key={`${connection.sourceId}-${connection.targetId}`}
                            start={getBlockCenter(sourceEl)}
                            end={getBlockCenter(targetEl)}
                          />
                        )
                      }
                      return null
                    })}

                    {previewConnection && (
                      <ConnectionLine
                        start={previewConnection.start}
                        end={previewConnection.end}
                        isPreview
                      />
                    )}
                  </svg>
                  
                  {/* Blocks */}
                  {strategy.blocks.map(block => {
                    const position = blockPositions.find(pos => pos.blockId === block.id)?.position || { x: 0, y: 0 }
                    
                    return (
                      <Block
                        key={block.id}
                        block={block}
                        selected={selectedBlock?.id === block.id}
                        position={position}
                        onClick={() => handleBlockClick(block)}
                        onConnectionStart={() => handleConnectionStart(block.id)}
                        onConnectionEnd={handleConnectionEnd}
                        onPositionChange={(newPos) => handleBlockDrag(block.id, newPos.x, newPos.y)}
                        onConfigChange={handleConfigChange}
                        onRemove={handleBlockRemove}
                      />
                    )
                  })}
                </CardContent>
              </Card>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="mt-4 rounded-lg border border-error/50 bg-error/10 p-4">
                  <div className="flex items-center space-x-2 text-error mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <h4 className="font-medium text-lightest">Validation Errors</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-lighter">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Configuration and Execution */}
          <div className="grid grid-cols-2 gap-6">
            {/* Config Summary Panel */}
            <div className="col-span-1">
              <BlockConfigSummary selectedBlock={selectedBlock} />
            </div>

            {/* Execution Panel */}
            <div className="col-span-1">
              <ExecutionPanel 
                strategy={strategy}
                onExecutionStateChange={handleExecutionStateChange}
                dcaConfig={dcaConfig} // Pass the DCAConfig as a prop
              />
            </div>
          </div>

          {/* Third Row: Price Monitoring and Strategy Testing */}
          <div className="grid grid-cols-2 gap-6">
            {/* Price Monitoring */}
            <div>
              <PriceMonitoringPanel 
                tokenAddress={selectedToken?.address || "0x..."} // Use selected token
                chainId={selectedToken?.chainId || 1}
              />
            </div>

            {/* Strategy Testing */}
            <div>
              <StrategyTester 
                strategy={strategy}
                selectedToken={selectedToken} // Pass selected token to tester
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 