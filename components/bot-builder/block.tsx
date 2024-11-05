'use client'

import * as React from 'react'
import { BlockType, Position } from './types'
import { Zap, DollarSign, Blocks, GripHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BlockProps {
  block: BlockType;
  selected: boolean;
  position: Position;
  onClick: () => void;
  onConnectionStart: () => void;
  onConnectionEnd: () => void;
  onPositionChange: (position: Position) => void;
  onConfigChange: (blockId: string, config: Record<string, any>) => void;
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
  const [localConfig, setLocalConfig] = React.useState(block.config)

  React.useEffect(() => {
    setLocalConfig(block.config)
  }, [block.config])

  const getBlockIcon = () => {
    switch (block.type) {
      case 'trigger':
        return <Zap className="h-4 w-4 text-accent" />
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

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = {
      ...block.config,
      [key]: value
    }
    onConfigChange(block.id, newConfig)
  }

  const renderConfigValue = (key: string, value: any) => {
    if (key === 'amount' || key === 'price' || key === 'stopPrice') {
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => handleConfigChange(key, parseFloat(e.target.value) || 0)}
          className="h-6 w-24 bg-darker border-accent/20 text-accent text-sm"
          step="0.000001"
          min="0"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
      )
    }
    if (key === 'condition') {
      return (
        <Select
          value={value}
          onValueChange={(v) => handleConfigChange(key, v)}
          onOpenChange={() => onClick()}
        >
          <SelectTrigger 
            className="h-6 w-24 bg-darker border-accent/20 text-accent text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <SelectValue>{value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="above">Above</SelectItem>
            <SelectItem value="below">Below</SelectItem>
            <SelectItem value="equals">Equals</SelectItem>
          </SelectContent>
        </Select>
      )
    }
    return <span className="font-medium text-accent">{value.toString()}</span>
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
      className={`
        relative p-4 bg-darker/80 border border-accent/20 rounded-lg backdrop-blur-sm
        min-w-[200px] select-none
        ${selected ? 'ring-2 ring-accent' : ''}
        ${isDragging ? 'opacity-75 cursor-grabbing shadow-lg' : 'cursor-grab shadow-md'}
        hover:shadow-lg hover:border-accent/50 hover:bg-darker
        transition-all duration-200
      `}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => {
        e.preventDefault()
        onConnectionStart()
      }}
    >
      <div className="absolute top-2 right-2">
        <GripHorizontal className="h-4 w-4 text-light" />
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
              <span className="capitalize text-light">{key}:</span>
              {renderConfigValue(key, value)}
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