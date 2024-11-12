"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useChain } from '@/contexts/ChainContext';
import { 
  Wallet, 
  CreditCard, 
  ArrowRightLeft, 
  Coins,
  AlertCircle,
  ChevronDown,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatAddress } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePriceData } from '@/hooks/usePriceData';

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  address: string;
  chainId: number;
  icon?: string;
}

export function AssetManagement() {
  const { isConnected, currentWallet } = useWalletConnection();
  const { selectedChain } = useChain();
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch assets when wallet is connected
  React.useEffect(() => {
    const fetchAssets = async () => {
      if (!isConnected || !currentWallet) return;
      
      setIsLoading(true);
      try {
        // In production, fetch real balances from the wallet
        const mockAssets: Asset[] = [
          {
            symbol: 'ETH',
            name: 'Ethereum',
            balance: 1.5,
            value: 3000,
            address: '0x...',
            chainId: 1,
          },
          {
            symbol: 'USDC',
            name: 'USD Coin',
            balance: 5000,
            value: 5000,
            address: '0x...',
            chainId: 1,
          },
          // Add more mock assets
        ];
        setAssets(mockAssets);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [isConnected, currentWallet]);

  const filteredAssets = assets.filter(asset => 
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-accent/20 bg-darker/50 backdrop-blur-sm">
      <CardHeader className="border-b border-accent/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-light" />
            <span className="text-lightest">Asset Management</span>
          </div>
          {isConnected && (
            <Button variant="outline" size="sm" className="text-xs">
              Import Token
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!isConnected ? (
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 mx-auto text-light/50 mb-4" />
            <p className="text-lighter/70 mb-4">Connect your wallet to manage assets</p>
            <Button variant="outline">Connect Wallet</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lighter/50" />
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-darker border-darker/60 text-lightest"
              />
            </div>

            {/* Asset List */}
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lighter/70">No assets found</p>
                </div>
              ) : (
                filteredAssets.map((asset) => (
                  <div
                    key={`${asset.chainId}-${asset.address}`}
                    className={cn(
                      "p-4 rounded-lg",
                      "border border-accent/10",
                      "bg-darker/30 backdrop-blur-sm",
                      "hover:bg-darker/50",
                      "transition-all duration-200",
                      selectedAsset?.address === asset.address && "border-accent/30 bg-darker/70"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                          <Coins className="h-4 w-4 text-light" />
                        </div>
                        <div>
                          <h4 className="font-medium text-lightest">{asset.symbol}</h4>
                          <p className="text-xs text-lighter/70">{asset.name}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Set Allocation</DropdownMenuItem>
                          <DropdownMenuItem>Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-lighter/70">
                        Balance: <span className="text-lightest">{asset.balance} {asset.symbol}</span>
                      </div>
                      <div className="text-lighter/70">
                        Value: <span className="text-lightest">${formatCurrency(asset.value)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {}}
              >
                <CreditCard className="h-4 w-4" />
                Deposit
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {}}
              >
                <ArrowRightLeft className="h-4 w-4" />
                Swap
              </Button>
            </div>

            {/* Warning */}
            <div className="p-3 rounded-lg border border-warning/20 bg-warning/5">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <p className="text-xs text-warning/80">
                  Always verify token addresses and ensure sufficient balance before creating trading strategies.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 