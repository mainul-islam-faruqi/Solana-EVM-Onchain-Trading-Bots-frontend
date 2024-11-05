"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export type ChainType = 'EVM' | 'SOLANA';

interface ChainContextType {
  selectedChain: ChainType;
  setSelectedChain: (chain: ChainType) => void;
  isWalletConnected: boolean;
  currentWalletAddress: string | null;
}

const ChainContext = createContext<ChainContextType | undefined>(undefined);

export function ChainProvider({ children }: { children: ReactNode }) {
  const [selectedChain, setSelectedChain] = useState<ChainType>('EVM');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentWalletAddress, setCurrentWalletAddress] = useState<string | null>(null);

  const value = {
    selectedChain,
    setSelectedChain,
    isWalletConnected,
    currentWalletAddress,
  };

  return (
    <ChainContext.Provider value={value}>
      {children}
    </ChainContext.Provider>
  );
}

export function useChain() {
  const context = useContext(ChainContext);
  if (context === undefined) {
    throw new Error('useChain must be used within a ChainProvider');
  }
  return context;
} 