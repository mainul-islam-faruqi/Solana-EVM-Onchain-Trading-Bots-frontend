'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, DollarSign, Blocks, Settings } from 'lucide-react';
import { BlockType } from './types';
import { format } from 'date-fns';
// import { TOKEN_PAIRS } from './block-registry';

interface BlockConfigSummaryProps {
  selectedBlock: BlockType | null;
}

interface TradingPair {
  id: string;
  name: string;
  inputToken: {
    symbol: string;
  };
  outputToken: {
    symbol: string;
  };
}

export function BlockConfigSummary({ selectedBlock }: BlockConfigSummaryProps) {
  return (
    <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/20">
        <CardTitle className="text-lightest">Configuration Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {selectedBlock ? (
          <div className="space-y-4">
            {/* Block Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-md bg-darker/80">
                  {selectedBlock.type === 'trigger' ? (
                    <Zap className="h-4 w-4 text-light" />
                  ) : selectedBlock.type === 'action' ? (
                    <DollarSign className="h-4 w-4 text-error" />
                  ) : (
                    <Blocks className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-lightest">{selectedBlock.label}</h3>
                  <p className="text-xs text-lighter/70">{selectedBlock.description}</p>
                </div>
              </div>
            </div>

            {/* Configuration Values */}
            <div className="space-y-3">
              {Object.entries(selectedBlock.config).map(([key, value]) => {
                // Skip internal fields
                if (key === 'availablePairs') return null;

                // Handle pair display
                if (key === 'pair' && typeof value === 'object' && value !== null) {
                  const pair = value as TradingPair;
                  return (
                    <div key={key} className="flex justify-between items-center py-1 border-b border-accent/10">
                      <span className="text-xs text-lighter/70">Trading Pair</span>
                      <span className="text-sm text-lightest">
                        {pair.name} ({pair.inputToken?.symbol} → {pair.outputToken?.symbol})
                      </span>
                    </div>
                  );
                }

                // Handle other values
                if (key === 'startAt' && value) {
                  if (typeof value !== 'string' && typeof value !== 'number') return null;
                  const timestamp = typeof value === 'string' ? parseInt(value) : value;
                  const date = new Date(timestamp);
                  const formattedDate = format(date, "MMMM d, yyyy 'at' h:mm aa");
                  return (
                    <div key={key} className="flex justify-between items-center py-1 border-b border-accent/10">
                      <span className="text-xs text-lighter/70">Start Time</span>
                      <span className="text-sm text-lightest">
                        {formattedDate}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={key} className="flex justify-between items-center py-1 border-b border-accent/10">
                    <span className="text-xs text-lighter/70">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-sm text-lightest">
                      {typeof value === 'boolean' 
                        ? value ? 'Yes' : 'No'
                        : value?.toString() || '-'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Block Type Info */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-lighter/70">Block Type</span>
                <span className="text-sm text-lightest capitalize">{selectedBlock.type}</span>
              </div>
              {selectedBlock.chainType && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs text-lighter/70">Chain Type</span>
                  <span className="text-sm text-lightest capitalize">{selectedBlock.chainType}</span>
                </div>
              )}
              {selectedBlock.category && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs text-lighter/70">Category</span>
                  <span className="text-sm text-lightest capitalize">{selectedBlock.category}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Settings className="h-5 w-5 text-lighter/50 mx-auto mb-2" />
            <p className="text-sm text-lighter/70">Select a block to view configuration</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 