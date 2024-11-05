'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockType } from './types'
import { Blocks, Zap, DollarSign } from 'lucide-react'

interface BlockLibraryProps {
  blocks: BlockType[];
  onDragStart: (e: React.DragEvent, block: BlockType) => void;
}

export function BlockLibrary({ blocks, onDragStart }: BlockLibraryProps) {
  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <Zap className="h-4 w-4 text-[#4CC9F0]" />
      case 'action':
        return <DollarSign className="h-4 w-4 text-[#F72585]" />
      default:
        return <Blocks className="h-4 w-4 text-[#4895EF]" />
    }
  }

  return (
    <Card className="border border-[#4895EF]/20 bg-[#1A1B41]/50 backdrop-blur-sm">
      <CardHeader className="border-b border-[#4895EF]/20">
        <CardTitle className="flex items-center space-x-2 text-[#4CC9F0]">
          <Blocks className="h-5 w-5" />
          <span>Block Library</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {blocks.map(block => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => onDragStart(e, block)}
              className="group flex items-center space-x-3 p-3 rounded-lg cursor-move 
                bg-[#1A1B41]/80 border border-[#4895EF]/10
                hover:bg-[#1A1B41] hover:border-[#4895EF]/30
                transition-all duration-200"
            >
              <div className="p-2 rounded-md bg-[#1A1B41]/50 group-hover:bg-[#1A1B41]/80">
                {getBlockIcon(block.type)}
              </div>
              <div>
                <div className="font-medium text-sm text-[#4CC9F0]">{block.label}</div>
                <div className="text-xs text-[#4CC9F0]/60">
                  {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 