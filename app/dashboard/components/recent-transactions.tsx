"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatAddress } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
  token: string;
  txHash: string;
  chain: 'ETH' | 'MATIC' | 'SOL';
}

export function RecentTransactions() {
  const [transactions] = React.useState<Transaction[]>([
    {
      id: '1',
      type: 'buy',
      amount: 0.5,
      price: 2345.67,
      timestamp: Date.now() - 1000 * 60 * 5,
      token: 'ETH',
      txHash: '0x1234...5678',
      chain: 'ETH'
    },
    {
      id: '2',
      type: 'sell',
      amount: 100,
      price: 1.05,
      timestamp: Date.now() - 1000 * 60 * 15,
      token: 'MATIC',
      chain: 'MATIC',
      txHash: '0x9876...4321' // Added missing required txHash property
    },
    // Add more transactions...
  ]);

  const getExplorerUrl = (tx: Transaction) => {
    switch (tx.chain) {
      case 'ETH':
        return `https://etherscan.io/tx/${tx.txHash}`;
      case 'MATIC':
        return `https://polygonscan.com/tx/${tx.txHash}`;
      case 'SOL':
        return `https://solscan.io/tx/${tx.txHash}`;
    }
  };

  return (
    <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-light" />
            <span className="text-lightest">Recent Transactions</span>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className={cn(
                "p-3 rounded-lg",
                "border border-accent/10",
                "bg-darker/30 backdrop-blur-sm",
                "hover:bg-darker/50",
                "transition-all duration-200"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {tx.type === 'buy' ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-error" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    tx.type === 'buy' ? "text-success" : "text-error"
                  )}>
                    {tx.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-lighter/70">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => window.open(getExplorerUrl(tx), '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 text-light/60" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-lighter">
                  {tx.amount} {tx.token}
                </span>
                <span className="font-medium text-lightest">
                  {formatCurrency(tx.price)}
                </span>
              </div>
              {tx.txHash && (
                <div className="mt-1 text-xs text-lighter/50">
                  {formatAddress(tx.txHash, 8)}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 