'use client'

import React from 'react';
import { Position } from './types';
import { cn } from '@/lib/utils';

interface ConnectionLineProps {
  start: Position;
  end: Position;
  isPreview?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ConnectionLine({ 
  start, 
  end, 
  isPreview = false,
  isSelected = false,
  onClick 
}: ConnectionLineProps) {
  // Calculate control points for the curve
  const midX = (start.x + end.x) / 2;
  const deltaX = Math.abs(end.x - start.x);
  const controlPointOffset = Math.min(deltaX * 0.5, 100);

  // Path data for curved line
  const path = `
    M ${start.x},${start.y}
    C ${start.x + controlPointOffset},${start.y}
    ${end.x - controlPointOffset},${end.y}
    ${end.x},${end.y}
  `;

  // Animation for the line drawing effect
  const pathLength = React.useRef<number>(0);
  const pathRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    if (pathRef.current) {
      pathLength.current = pathRef.current.getTotalLength();
    }
  }, [path]);

  return (
    <g>
      {/* Connection shadow */}
      <path
        d={path}
        fill="none"
        className={cn(
          "stroke-accent/5",
          "stroke-[8]",
          "filter blur-[4px]"
        )}
      />

      {/* Main connection line */}
      <path
        ref={pathRef}
        d={path}
        fill="none"
        onClick={onClick}
        style={{
          strokeDasharray: isPreview ? `${pathLength.current} ${pathLength.current}` : 'none',
          strokeDashoffset: isPreview ? pathLength.current : 0,
        }}
        className={cn(
          "transition-all duration-300",
          isPreview
            ? "stroke-accent/30 stroke-[2] animate-dash"
            : isSelected
            ? "stroke-accent stroke-[3] filter drop-shadow-[0_0_4px_rgba(139,92,246,0.3)]"
            : "stroke-accent/50 stroke-[2] hover:stroke-accent",
          "cursor-pointer",
          !isPreview && "hover:stroke-[3]"
        )}
      />

      {/* Connection points */}
      {!isPreview && (
        <>
          <circle
            cx={start.x}
            cy={start.y}
            r={4}
            className={cn(
              "fill-accent/50",
              "stroke-darker",
              "stroke-2",
              isSelected && "fill-accent"
            )}
          />
          <circle
            cx={end.x}
            cy={end.y}
            r={4}
            className={cn(
              "fill-accent/50",
              "stroke-darker",
              "stroke-2",
              isSelected && "fill-accent"
            )}
          />
        </>
      )}

      {/* Flow animation */}
      {!isPreview && (
        <circle
          r={3}
          className={cn(
            "fill-accent",
            "filter drop-shadow-[0_0_4px_rgba(139,92,246,0.5)]"
          )}
        >
          <animateMotion
            dur="1.5s"
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      )}
    </g>
  );
} 