'use client'

import React, { useState, useEffect } from 'react';
import { BlockType, Position } from './types'
import { Zap, DollarSign, Blocks, GripHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { TOKEN_MINTS } from '@/lib/solana/constants'
import { TRADING_PAIRS } from '@/lib/constants/token-pairs'
import { DCA_PAIRS } from './block-registry'

interface BlockProps {
  block: BlockType;
  selected: boolean;
  position: Position;
  onClick: () => void;
  onConnectionStart: () => void;
  onConnectionEnd: () => void;
  onPositionChange: (position: Position) => void;
  onConfigChange: (blockId: string, config: Record<string, unknown>) => void;
}

export function Block({ 
  block, 
  selected, 
  position,
  onClick, 
  onConnectionStart, 
  onConnectionEnd,
  onPositionChange,
  onConfigChange
}: BlockProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragOffset, setDragOffset] = React.useState<Position>({ x: 0, y: 0 })
  const [localConfig, setLocalConfig] = useState(block.config)

  useEffect(() => {
    setLocalConfig(block.config)
  }, [block.config])

  const handleConfigChange = (key: string, value: unknown) => {
    const newConfig = {
      ...localConfig,
      [key]: value
    }
    setLocalConfig(newConfig)
    onConfigChange(block.id, newConfig)
  }

  const renderDcaConfig = () => {
    if (block.type !== 'dca') return null

    return (
      <div className="space-y-2 mb-4">
        <div>
          <label className="text-xs text-lighter">Trading Pair</label>
          <Select
            value={localConfig.tradingPair as string}
            onValueChange={(pairId) => {
              const selectedPair = DCA_PAIRS.find(p => p.id === pairId)
              if (selectedPair) {
                handleConfigChange('tradingPair', pairId)
                handleConfigChange('inputToken', selectedPair.inputToken.mint.toString())
                handleConfigChange('outputToken', selectedPair.outputToken.mint.toString())
                handleConfigChange('inputSymbol', selectedPair.inputToken.symbol)
                handleConfigChange('outputSymbol', selectedPair.outputToken.symbol)
              }
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select trading pair" />
            </SelectTrigger>
            <SelectContent>
              {DCA_PAIRS.map((pair) => (
                <SelectItem key={pair.id} value={pair.id}>
                  {pair.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Show selected pair info */}
        {localConfig.tradingPair && (
          <div className="text-xs text-lighter/70 px-2">
            Trading {localConfig.inputSymbol} → {localConfig.outputSymbol}
          </div>
        )}

        {/* Other DCA specific inputs */}
        <div>
          <label className="text-xs text-lighter">Amount per cycle</label>
          <input
            type="number"
            value={localConfig.inAmountPerCycle || 0}
            onChange={(e) => handleConfigChange('inAmountPerCycle', parseFloat(e.target.value))}
            className="w-full h-8 text-xs bg-darker/50 border border-accent/20 rounded px-2"
          />
        </div>

        <div>
          <label className="text-xs text-lighter">Cycle Frequency (seconds)</label>
          <input
            type="number"
            value={localConfig.cycleFrequency || 3600}
            onChange={(e) => handleConfigChange('cycleFrequency', parseFloat(e.target.value))}
            className="w-full h-8 text-xs bg-darker/50 border border-accent/20 rounded px-2"
          />
        </div>
      </div>
    )
  }

  const renderConfigInput = (key: string, value: unknown) => {
    if (key === 'inputToken' || key === 'outputToken') {
      return null
    }

    const commonClasses = cn(
      "bg-darker border-darker/60 text-light text-sm",
      "focus:border-accent/40 focus:ring-2 focus:ring-accent/20",
      "rounded px-2 py-1 w-full"
    )

    if (key === 'pair') {
      return (
        <Select
          value={value as string}
          onValueChange={(newValue) => handleConfigChange(key, newValue)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select pair" />
          </SelectTrigger>
          <SelectContent>
            {DCA_PAIRS.map((pair) => (
              <SelectItem key={pair.id} value={pair.id}>
                {pair.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (typeof value === 'number') {
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => handleConfigChange(key, parseFloat(e.target.value))}
          className={commonClasses}
        />
      )
    }

    if (typeof value === 'string') {
      return (
        <Input
          type="text"
          value={value}
          onChange={(e) => handleConfigChange(key, e.target.value)}
          className={commonClasses}
        />
      )
    }

    return null
  }

  const getBlockIcon = () => {
    switch (block.type) {
      case 'trigger':
        return <Zap className="h-4 w-4 text-light" />
      case 'action':
        return <DollarSign className="h-4 w-4 text-error" />
      default:
        return <Blocks className="h-4 w-4 text-primary" />
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      onConnectionStart()
      return
    }

    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    onPositionChange({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    })
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
    } else {
      onConnectionEnd()
    }
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
  }, [isDragging])

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg backdrop-blur-sm",
        "min-w-[200px] select-none transition-all duration-200",
        "border border-accent/20",
        "bg-gradient-to-br from-darker/80 to-darker/60",
        selected && "ring-2 ring-accent shadow-lg shadow-accent/10",
        isDragging ? [
          "opacity-75 cursor-grabbing",
          "shadow-xl shadow-accent/20"
        ] : [
          "cursor-grab shadow-md",
          "hover:shadow-lg hover:shadow-accent/10",
          "hover:border-accent/50",
          "hover:bg-darker/70"
        ]
      )}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => {
        e.preventDefault()
        onConnectionStart()
      }}
    >
      <div className="absolute top-2 right-2">
        <GripHorizontal className="h-4 w-4 text-lighter" />
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <div className="p-1.5 rounded-md bg-darker border border-accent/10">
          {getBlockIcon()}
        </div>
        <div className="font-medium text-lightest">{block.label}</div>
      </div>

      {localConfig && (
        <div className="space-y-1 text-sm bg-darker p-2 rounded border border-accent/10">
          {Object.entries(localConfig).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="capitalize text-lighter">{key}:</span>
              {renderConfigInput(key, value)}
            </div>
          ))}
        </div>
      )}
      
      {/* Connection points */}
      <div className="absolute -left-3 top-1/2 w-6 h-6 bg-darker border-2 border-accent rounded-full transform -translate-y-1/2 
        hover:scale-110 hover:border-light hover:bg-accent/10
        transition-all duration-200" />
      <div className="absolute -right-3 top-1/2 w-6 h-6 bg-darker border-2 border-accent rounded-full transform -translate-y-1/2
        hover:scale-110 hover:border-light hover:bg-accent/10
        transition-all duration-200" />
    </div>
  )
}
