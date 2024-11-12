"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Users, Activity, Blocks, ChevronRight } from 'lucide-react';
import { StrategyTemplate } from '@/types/templates';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: StrategyTemplate;
  onSelect: () => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden",
        "border-accent/10 bg-darker/50 backdrop-blur-sm",
        "hover:shadow-lg hover:shadow-accent/5",
        "hover:border-accent/20",
        "hover:bg-darker/70",
        "transition-all duration-300"
      )}
    >
      {/* Difficulty Badge */}
      <div className="absolute top-3 right-3">
        <span className={cn(
          "text-xs px-2 py-1 rounded-full",
          "border backdrop-blur-sm",
          template.difficulty === 'Beginner' && "border-emerald-400/20 bg-emerald-500/10 text-emerald-400",
          template.difficulty === 'Intermediate' && "border-violet-400/20 bg-violet-500/10 text-violet-400",
          template.difficulty === 'Advanced' && "border-orange-400/20 bg-orange-500/10 text-orange-400"
        )}>
          {template.difficulty}
        </span>
      </div>

      <CardHeader className="space-y-2 pb-4">
        <div className="space-y-1">
          <h3 className="font-medium text-lg text-lightest group-hover:text-light transition-colors">
            {template.name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-lighter/70">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{template.usageCount} uses</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span>{template.likes}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-lighter/70 line-clamp-2">
          {template.description}
        </p>

        {/* Strategy Info */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-darker/50 rounded-lg border border-accent/10 p-2">
            <div className="flex items-center gap-1.5 text-xs text-lighter/70">
              <Blocks className="h-3 w-3" />
              <span>{template.strategy.blocks.length} Blocks</span>
            </div>
          </div>
          <div className="bg-darker/50 rounded-lg border border-accent/10 p-2">
            <div className="flex items-center gap-1.5 text-xs text-lighter/70">
              <Activity className="h-3 w-3" />
              <span>{template.strategy.connections.length} Connections</span>
            </div>
          </div>
        </div>

        {/* Chain Support */}
        <div className="flex gap-1.5">
          {template.chainSupport.map((chain) => (
            <span
              key={chain}
              className={cn(
                "text-xs px-2 py-1 rounded-lg",
                "border border-accent/10",
                "bg-darker/50 text-lighter/90"
              )}
            >
              {chain}
            </span>
          ))}
        </div>

        {/* Use Template Button */}
        <Button
          variant="ghost"
          className={cn(
            "w-full",
            "bg-accent/5 hover:bg-accent/10",
            "text-light hover:text-light",
            "border border-accent/10 hover:border-accent/20",
            "transition-all duration-200"
          )}
          onClick={onSelect}
        >
          <span>Use Template</span>
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
} 