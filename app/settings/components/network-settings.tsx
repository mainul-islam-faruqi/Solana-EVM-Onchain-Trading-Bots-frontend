"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface NetworkSettingsProps {
  onChange: () => void;
}

export function NetworkSettings({ onChange }: NetworkSettingsProps) {
  return (
    <div className="space-y-6">
      {/* EVM Networks */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-lightest">EVM Networks</h3>
        
        {/* Ethereum RPC */}
        <div className="space-y-2">
          <Label htmlFor="eth-rpc" className="text-lighter/70">Ethereum RPC URL</Label>
          <Input
            id="eth-rpc"
            placeholder="https://mainnet.infura.io/v3/your-api-key"
            className={cn(
              "bg-darker border-darker/60 text-lightest",
              "focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
            )}
            onChange={onChange}
          />
        </div>

        {/* Polygon RPC */}
        <div className="space-y-2">
          <Label htmlFor="polygon-rpc" className="text-lighter/70">Polygon RPC URL</Label>
          <Input
            id="polygon-rpc"
            placeholder="https://polygon-rpc.com"
            className={cn(
              "bg-darker border-darker/60 text-lightest",
              "focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
            )}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Solana Network */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-lightest">Solana Network</h3>
        
        <div className="space-y-2">
          <Label htmlFor="solana-network" className="text-lighter/70">Network</Label>
          <Select defaultValue="mainnet" onValueChange={onChange}>
            <SelectTrigger 
              className={cn(
                "bg-darker border-darker/60 text-lightest",
                "focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
              )}
            >
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mainnet">Mainnet</SelectItem>
              <SelectItem value="devnet">Devnet</SelectItem>
              <SelectItem value="testnet">Testnet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="solana-rpc" className="text-lighter/70">Custom RPC URL (Optional)</Label>
          <Input
            id="solana-rpc"
            placeholder="https://api.mainnet-beta.solana.com"
            className={cn(
              "bg-darker border-darker/60 text-lightest",
              "focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
            )}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
} 