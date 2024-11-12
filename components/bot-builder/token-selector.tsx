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

interface TokenSelectorProps {
  onSelect: (token: any) => void;
  selectedToken?: any;
  label?: string;
}

export function TokenSelector({ onSelect, selectedToken, label }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { isConnected } = useWalletConnection();

  // Mock token list - replace with real token data
  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', address: '0x...', balance: 1.5 },
    { symbol: 'USDC', name: 'USD Coin', address: '0x...', balance: 5000 },
    // Add more tokens
  ];

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between",
            "bg-darker border-darker/60 text-lightest",
            "hover:bg-darker/80 hover:border-accent/20"
          )}
        >
          <div className="flex items-center gap-2">
            {selectedToken ? (
              <>
                <div className="p-1 rounded-md bg-accent/10">
                  <Coins className="h-4 w-4 text-light" />
                </div>
                <span>{selectedToken.symbol}</span>
              </>
            ) : (
              <span className="text-lighter/70">{label || 'Select Token'}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-lighter/50" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lighter/50" />
            <Input
              placeholder="Search by name or paste address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-darker border-darker/60 text-lightest"
            />
          </div>

          {/* Token List */}
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {filteredTokens.map((token) => (
              <Button
                key={token.address}
                variant="ghost"
                className={cn(
                  "w-full justify-between p-3 h-auto",
                  "hover:bg-accent/5",
                  selectedToken?.address === token.address && "bg-accent/10"
                )}
                onClick={() => {
                  onSelect(token);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                    <Coins className="h-4 w-4 text-light" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-lightest">{token.symbol}</div>
                    <div className="text-xs text-lighter/70">{token.name}</div>
                  </div>
                </div>
                {isConnected && (
                  <div className="text-sm text-lighter/70">
                    Balance: {token.balance}
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 