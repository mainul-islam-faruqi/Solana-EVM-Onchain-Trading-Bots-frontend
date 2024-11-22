"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Search, Coins, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { usePriceData } from '@/hooks/usePriceData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AVAILABLE_PAIRS, TokenInfo } from '@/lib/constants/token-pairs';

interface TokenSelectorProps {
  onSelect: (inputToken: TokenInfo, outputToken: TokenInfo) => void;
  selectedInputToken?: TokenInfo;
  selectedOutputToken?: TokenInfo;
}

export function TokenSelector({ onSelect, selectedInputToken, selectedOutputToken }: TokenSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-lighter">Input Token</label>
        <Select
          value={selectedInputToken?.symbol}
          onValueChange={(symbol) => {
            const pair = AVAILABLE_PAIRS.find(p => p.inputToken.symbol === symbol);
            if (pair) {
              onSelect(pair.inputToken, selectedOutputToken || pair.outputToken);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select input token" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_PAIRS.map(pair => (
              <SelectItem key={pair.inputToken.symbol} value={pair.inputToken.symbol}>
                {pair.inputToken.name} ({pair.inputToken.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-lighter">Output Token</label>
        <Select
          value={selectedOutputToken?.symbol}
          onValueChange={(symbol) => {
            const pair = AVAILABLE_PAIRS.find(p => p.outputToken.symbol === symbol);
            if (pair) {
              onSelect(selectedInputToken || pair.inputToken, pair.outputToken);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select output token" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_PAIRS.map(pair => (
              <SelectItem key={pair.outputToken.symbol} value={pair.outputToken.symbol}>
                {pair.outputToken.name} ({pair.outputToken.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 