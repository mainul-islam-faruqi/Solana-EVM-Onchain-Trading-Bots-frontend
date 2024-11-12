'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockType } from './types'
import { Blocks, Zap, DollarSign } from 'lucide-react'
import { COLORS } from '@/lib/constants/colors'

interface BlockLibraryProps {
  blocks: BlockType[];
  onDragStart: (e: React.DragEvent, block: BlockType) => void;
}

export function BlockLibrary({ blocks, onDragStart }: BlockLibraryProps) {
  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <Zap className={`h-4 w-4 text-light`} />
      case 'action':
        return <DollarSign className={`h-4 w-4 text-error`} />
      default:
        return <Blocks className={`h-4 w-4 text-primary`} />
    }
  }

  return (
    <Card className="border border-accent/20 bg-darker/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/20">
        <CardTitle className="flex items-center space-x-2 text-primary">
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
                bg-darker/80 border border-accent/10
                hover:bg-darker hover:border-accent/30
                transition-all duration-200"
            >
              <div className="p-2 rounded-md bg-darker/50 group-hover:bg-darker/80">
                {getBlockIcon(block.type)}
              </div>
              <div>
                <div className="font-medium text-sm text-primary">{block.label}</div>
                <div className="text-xs text-lighter/70">
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