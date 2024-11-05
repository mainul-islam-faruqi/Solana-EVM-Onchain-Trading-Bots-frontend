'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockType, BotStrategy, BlockPosition, Position } from './types'
import { BlockConfigPanel } from './block-config-panel'
import { ConnectionLine } from './connection-line'
import { BlockLibrary } from './block-library'
import { Block } from './block'
import { ValidationService } from './validation-service'
import { ValidationError } from './types'
import { ExecutionPanel } from './execution/execution-panel'
import { AlertCircle } from 'lucide-react'
import { AVAILABLE_BLOCKS, createBlock } from './block-registry'


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

  const handleConfigChange = (blockId: string, config: Record<string, any>) => {
    setStrategy(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId ? { ...block, config } : block
      )
    }))
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkest to-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          {/* Strategy Builder Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Block Library */}
            <div className="lg:col-span-1">
              <BlockLibrary
                blocks={availableBlocks}
                onDragStart={handleDragStart}
              />
            </div>

            {/* Canvas */}
            <div className="lg:col-span-3">
              <Card 
                className="border border-accent/20 bg-darker/50 backdrop-blur-sm"
                onDrop={handleBlockDrop}
                onDragOver={handleDragOver}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setPreviewConnection(null)}
              >
                <CardHeader className="border-b border-accent/20">
                  <CardTitle className="text-lg font-medium text-lightest">Strategy Canvas</CardTitle>
                </CardHeader>
                <CardContent className="relative p-0 min-h-[600px] bg-[url('/grid.svg')] bg-center">
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

              {/* Configuration and Execution */}
              <div className="grid grid-cols-2 gap-6 mt-6">
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
          </div>
        </div>
      </div>
    </div>
  )
} 