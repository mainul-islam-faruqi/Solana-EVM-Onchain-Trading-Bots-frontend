'use client'

import * as React from 'react'

interface ConnectionPointProps {
  position: 'input' | 'output';
  onConnect: () => void;
}

export function ConnectionPoint({ position, onConnect }: ConnectionPointProps) {
  return (
    <div
      className={`absolute w-3 h-3 bg-primary rounded-full cursor-pointer
        ${position === 'input' ? 'left-0 top-1/2 -translate-x-1/2' : 'right-0 top-1/2 translate-x-1/2'}
      `}
      onClick={(e) => {
        e.stopPropagation()
        onConnect()
      }}
    />
  )
} 