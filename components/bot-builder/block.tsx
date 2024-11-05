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
  onConfigChange?: (config: Record<string, any>) => void;
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

  const getBlockIcon = () => {
    switch (block.type) {
      case 'trigger':
        return <Zap className="h-4 w-4 text-[#4CC9F0]" />
      case 'action':
        return <DollarSign className="h-4 w-4 text-[#F72585]" />
      default:
        return <Blocks className="h-4 w-4 text-[#4895EF]" />
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
    if (onConfigChange) {
      onConfigChange({
        ...block.config,
        [key]: value
      })
    }
  }

  const renderConfigValue = (key: string, value: any) => {
    if (key === 'amount' || key === 'price' || key === 'stopPrice') {
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => handleConfigChange(key, parseFloat(e.target.value))}
          className="h-6 w-24 bg-[#1A1B41] border-[#4895EF]/20 text-[#4CC9F0] text-sm"
          step="0.000001"
          min="0"
        />
      )
    }
    if (key === 'condition') {
      return (
        <Select
          value={value}
          onValueChange={(v) => handleConfigChange(key, v)}
        >
          <SelectTrigger className="h-6 w-24 bg-[#1A1B41] border-[#4895EF]/20 text-[#4CC9F0] text-sm">
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
    return <span className="font-medium text-[#4CC9F0]">{value.toString()}</span>
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
        relative p-4 bg-[#1A1B41]/80 border border-[#4895EF]/20 rounded-lg backdrop-blur-sm
        min-w-[200px] select-none
        ${selected ? 'ring-2 ring-[#4CC9F0]' : ''}
        ${isDragging ? 'opacity-75 cursor-grabbing shadow-lg' : 'cursor-grab shadow-md'}
        hover:shadow-lg hover:border-[#4CC9F0]/50 hover:bg-[#1A1B41]
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
        <GripHorizontal className="h-4 w-4 text-[#4CC9F0]/60" />
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <div className="p-1.5 rounded-md bg-[#1A1B41] border border-[#4895EF]/10">
          {getBlockIcon()}
        </div>
        <div className="font-medium text-[#4CC9F0]">{block.label}</div>
      </div>

      {block.config && (
        <div className="space-y-1 text-sm bg-[#1A1B41] p-2 rounded border border-[#4895EF]/10">
          {Object.entries(block.config).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="capitalize text-[#4CC9F0]/60">{key}:</span>
              {renderConfigValue(key, value)}
            </div>
          ))}
        </div>
      )}
      
      {/* Connection points */}
      <div className="absolute -left-3 top-1/2 w-6 h-6 bg-[#1A1B41] border-2 border-[#4CC9F0] rounded-full transform -translate-y-1/2 
        hover:scale-110 hover:border-[#4CC9F0] hover:bg-[#4CC9F0]/10
        transition-all duration-200" />
      <div className="absolute -right-3 top-1/2 w-6 h-6 bg-[#1A1B41] border-2 border-[#4CC9F0] rounded-full transform -translate-y-1/2
        hover:scale-110 hover:border-[#4CC9F0] hover:bg-[#4CC9F0]/10
        transition-all duration-200" />
    </div>
  )
} 