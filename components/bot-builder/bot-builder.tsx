'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockType, BotStrategy, BlockPosition, Position } from './types'
import { BlockConfigPanel } from './block-config-panel'
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
import { TemplateService } from '@/lib/services/template-service';
import { Button } from '@/components/ui/button';
import { useStrategyTemplate } from '@/hooks/useStrategyTemplate';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PriceMonitoringPanel } from './price-monitoring/price-panel';


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
      const rect = e.currentTarget.getBoundingClientRect()
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      
      setStrategy(prev => ({
        ...prev,
        blocks: [...prev.blocks, newBlock]
      }))
      
      setBlockPositions(prev => [...prev, {
        blockId: newBlock.id,
        position
      }])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleBlockClick = (block: BlockType) => {
    setSelectedBlock(block)
  }

  const handleConfigChange = (blockId: string, newConfig: Record<string, any>) => {
    setStrategy(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId 
          ? { ...block, config: newConfig }
          : block
      )
    }));

    // Update selected block if it's the one being modified
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(prev => 
        prev ? { ...prev, config: newConfig } : null
      );
    }
  };

  const handleConnectionStart = (blockId: string) => {
    setConnecting({ sourceId: blockId })
  }

  const handleConnectionEnd = (targetId: string) => {
    if (connecting && connecting.sourceId !== targetId) {
      const newConnection = {
        id: crypto.randomUUID(),
        sourceId: connecting.sourceId,
        targetId
      }

      const updatedStrategy = {
        ...strategy,
        connections: [...strategy.connections, newConnection]
      }

      const result = validationService.validateStrategy(updatedStrategy)
      
      if (result.isValid) {
        setStrategy(updatedStrategy)
      } else {
        setValidationErrors(result.errors)
      }
    }
    setConnecting(null)
    setPreviewConnection(null)
  }

  const getBlockCenter = (element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
  }

  const handleBlockPositionChange = (blockId: string, newPosition: Position) => {
    setBlockPositions(prev => prev.map(bp => 
      bp.blockId === blockId ? { ...bp, position: newPosition } : bp
    ))
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (connecting) {
      const rect = e.currentTarget.getBoundingClientRect()
      setPreviewConnection({
        start: getBlockCenter(blockRefs.current.get(connecting.sourceId)!),
        end: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
      })
    }
  }

  const handleBlockConfigChange = (blockId: string, newConfig: Record<string, any>) => {
    setStrategy(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId ? { ...block, config: newConfig } : block
      )
    }))

    if (selectedBlock?.id === blockId) {
      setSelectedBlock(prev => prev ? { ...prev, config: newConfig } : null)
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
                  <p className="text-sm text-light/60">
                    Review the template strategy before customizing
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleResetStrategy}
                    className="border-accent/20 text-accent"
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
                <p className="text-light">Loading template...</p>
              </div>
            </div>
          )}

          {/* Strategy Builder Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Block Library */}
            <div className="lg:col-span-3" ref={blockLibraryRef}>
              <BlockLibrary
                blocks={availableBlocks}
                onDragStart={handleDragStart}
              />
            </div>

            {/* Canvas */}
            <div className="lg:col-span-9">
              <Card 
                className={cn(
                  "border border-accent/20 bg-darker/50 backdrop-blur-sm",
                  "relative transition-all duration-200"
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
                <CardContent className="relative p-0">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-darker/5 via-darker/10 to-darker/20" />

                  {/* Connections */}
                  <svg className="absolute inset-0 pointer-events-none">
                    {strategy.connections.map(connection => {
                      const sourceEl = blockRefs.current.get(connection.sourceId)
                      const targetEl = blockRefs.current.get(connection.targetId)
                      if (sourceEl && targetEl) {
                        return (
                          <ConnectionLine
                            key={connection.id}
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
                    const position = blockPositions.find(bp => bp.blockId === block.id)?.position
                    return position && (
                      <div
                        key={block.id}
                        style={{
                          position: 'absolute',
                          left: position.x,
                          top: position.y,
                          transform: 'translate(-50%, -50%)'
                        }}
                        ref={(el: HTMLDivElement | null) => {
                          if (el) blockRefs.current.set(block.id, el)
                        }}
                      >
                        <Block
                          block={block}
                          position={position}
                          selected={selectedBlock?.id === block.id}
                          onClick={() => handleBlockClick(block)}
                          onConnectionStart={() => handleConnectionStart(block.id)}
                          onConnectionEnd={() => handleConnectionEnd(block.id)}
                          onPositionChange={(newPosition) => 
                            handleBlockPositionChange(block.id, newPosition)
                          }
                          onConfigChange={handleConfigChange}
                        />
                      </div>
                    )
                  })}

                  {/* Empty state */}
                  {strategy.blocks.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-lightest">
                      <div className="text-center">
                        <div className="inline-block p-3 rounded-full bg-darker/50 mb-4">
                          <AlertCircle className="w-6 h-6 text-light" />
                        </div>
                        <p className="text-sm text-light">Drag blocks from the library to start building your strategy</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="mt-4 rounded-lg border border-error/50 bg-error/10 p-4">
                  <div className="flex items-center space-x-2 text-error mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <h4 className="font-medium text-lightest">Validation Errors</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-light">
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
            <div className="col-span-1">
              {selectedBlock ? (
                <BlockConfigPanel
                  selectedBlock={selectedBlock}
                  onConfigChange={handleConfigChange}
                />
              ) : (
                <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm h-full">
                  <CardContent className="flex items-center justify-center min-h-[300px] text-lightest">
                    <p className="text-sm">Select a block to configure</p>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="col-span-1">
              <ExecutionPanel strategy={strategy} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Price Monitoring */}
            <div className="lg:col-span-1">
              <PriceMonitoringPanel 
                tokenAddress="0x..." // Get from selected token
                chainId={1} // Get from selected network
              />
          </div>
          <div className="lg:col-span-1">
            <StrategyTester strategy={strategy} />
          </div>
        </div>
      </div>
    </div>
  )
} 