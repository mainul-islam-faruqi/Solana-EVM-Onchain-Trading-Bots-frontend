'use client'

import React from 'react';
import { BlockType } from './types'
import { Zap, DollarSign, Blocks, GripHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BlockConfigPanel } from './block-config-panel'

interface BlockProps {
  block: BlockType;
  selected: boolean;
  position: { x: number; y: number };
  onClick: () => void;
  onConnectionStart: () => void;
  onConnectionEnd: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onConfigChange: (blockId: string, config: Record<string, unknown>) => void;
  onRemove: (blockId: string) => void;
}

export function Block({ 
  block, 
  selected, 
  position,
  onClick, 
  onConnectionStart, 
  onConnectionEnd,
  onPositionChange,
  onConfigChange,
  onRemove
}: BlockProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 })
  const [showRemove, setShowRemove] = React.useState(false)

  const getBlockIcon = () => {
    switch (block.type) {
      case 'trigger':
        return <Zap className="h-3.5 w-3.5 text-light" />
      case 'action':
        return <DollarSign className="h-3.5 w-3.5 text-error" />
      default:
        return <Blocks className="h-3.5 w-3.5 text-primary" />
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      onConnectionStart()
      return
    }

    const canvas = document.querySelector('.strategy-canvas')
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - (position.x + canvasRect.left),
      y: e.clientY - (position.y + canvasRect.top)
    })

    // Prevent text selection during drag
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const canvas = document.querySelector('.strategy-canvas')
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    const blockEl = document.querySelector(`[data-block-id="${block.id}"]`) as HTMLElement
    if (!blockEl) return

    const blockRect = blockEl.getBoundingClientRect()

    // Calculate raw position
    let newX = e.clientX - dragOffset.x
    let newY = e.clientY - dragOffset.y

    // Convert to canvas-relative position
    newX -= canvasRect.left
    newY -= canvasRect.top

    // Apply canvas boundaries
    const padding = 10
    const minX = padding
    const maxX = canvasRect.width - blockRect.width - padding
    const minY = padding
    const maxY = canvasRect.height - blockRect.height - padding

    // Clamp position within canvas
    newX = Math.max(minX, Math.min(maxX, newX))
    newY = Math.max(minY, Math.min(maxY, newY))

    onPositionChange({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    } else {
      onConnectionEnd()
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent block selection
    onRemove(block.id)
  }

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  return (
    <div
      data-block-id={block.id}
      className={cn(
        "relative p-2.5 rounded-lg backdrop-blur-sm",
        block.type === 'dca' ? "min-w-[280px] max-w-[320px]" : "min-w-[180px] max-w-[220px]",
        "select-none transition-all duration-200",
        "bg-gradient-to-br from-darker/80 to-darker/60",
        "border border-accent/10",
        selected && "ring-1 ring-accent shadow-lg shadow-accent/10",
        isDragging ? [
          "opacity-75 cursor-grabbing",
          "shadow-xl shadow-accent/20",
          "border-accent/20"
        ] : [
          "cursor-grab shadow-md",
          "hover:shadow-lg hover:shadow-accent/10",
          "hover:border-accent/20",
          "hover:bg-darker/70"
        ]
      )}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}
      onContextMenu={(e) => {
        e.preventDefault()
        onConnectionStart()
      }}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
      }}
    >
      <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
        {showRemove && (
          <button
            onClick={handleRemove}
            className={cn(
              "p-0.5 rounded hover:bg-error/10 group",
              "transition-colors duration-200"
            )}
          >
            <X className="h-3.5 w-3.5 text-lighter/50 group-hover:text-error/80" />
          </button>
        )}
        <GripHorizontal className="h-3.5 w-3.5 text-lighter/50" />
      </div>

      <div className="flex items-center space-x-2 mb-1.5">
        <div className="p-1 rounded-md bg-darker/80">
          {getBlockIcon()}
        </div>
        <div className="text-sm font-medium text-lightest">{block.label}</div>
      </div>

      {/* Block Configuration Panel */}
      <div className="bg-darker/50 p-1.5 rounded">
        <BlockConfigPanel
          selectedBlock={block}
          onConfigChange={(blockId, newConfig) => {
            onConfigChange(block.id, newConfig);
          }}
        />
      </div>
      
      {/* Connection points */}
      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-darker border border-accent/20 rounded-full transform -translate-y-1/2 
        hover:scale-110 hover:border-accent hover:bg-accent/5
        transition-all duration-200" />
      <div className="absolute -right-2 top-1/2 w-4 h-4 bg-darker border border-accent/20 rounded-full transform -translate-y-1/2
        hover:scale-110 hover:border-accent hover:bg-accent/5
        transition-all duration-200" />
    </div>
  )
}
