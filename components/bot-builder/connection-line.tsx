'use client'

import * as React from 'react'
import { Position } from './types'

interface ConnectionLineProps {
  start: Position;
  end: Position;
  isPreview?: boolean;
}

export function ConnectionLine({ start, end, isPreview = false }: ConnectionLineProps) {
  // Calculate control points for a smooth curve
  const dx = end.x - start.x
  const dy = end.y - start.y
  const controlPoint1 = {
    x: start.x + dx * 0.5,
    y: start.y
  }
  const controlPoint2 = {
    x: end.x - dx * 0.5,
    y: end.y
  }

  const pathD = `M ${start.x} ${start.y} 
                 C ${controlPoint1.x} ${controlPoint1.y},
                   ${controlPoint2.x} ${controlPoint2.y},
                   ${end.x} ${end.y}`

  return (
    <>
      {/* Shadow effect */}
      <path
        d={pathD}
        stroke="#7B2CBF"
        strokeWidth={4}
        fill="none"
        filter="blur(4px)"
        opacity={0.1}
      />
      
      {/* Main line */}
      <path
        d={pathD}
        stroke={isPreview ? '#9D4EDD' : '#9D4EDD'}
        strokeWidth={2}
        fill="none"
        opacity={isPreview ? 0.5 : 1}
        className={`
          transition-all duration-300 ease-in-out
          ${isPreview ? 'stroke-dasharray: 5,5' : ''}
        `}
        markerEnd="url(#arrowhead)"
      />
      
      {/* Arrow head */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={isPreview ? '#9D4EDD' : '#9D4EDD'}
            opacity={isPreview ? 0.5 : 1}
          />
        </marker>
      </defs>
    </>
  )
} 