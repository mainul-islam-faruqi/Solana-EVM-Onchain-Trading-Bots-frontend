"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BiconomySmartAccount, BiconomySmartAccountConfig } from '@biconomy/account';
import { ChainId } from '@biconomy/core-types';
import { useAccount, useNetwork } from 'wagmi';

interface SmartAccountContextType {
  smartAccount: BiconomySmartAccount | null;
  loading: boolean;
  error: Error | null;
}

const SmartAccountContext = createContext<SmartAccountContextType | undefined>(undefined);

export function SmartAccountProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (address && chain) {
      initSmartAccount();
    }
  }, [address, chain]);

  const initSmartAccount = async () => {
    try {
      setLoading(true);
      // Initialize Biconomy Smart Account
      const config: BiconomySmartAccountConfig = {
        signer: /* your web3 provider signer */,
        chainId: chain?.id || ChainId.MAINNET,
        biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY!,
      };
      
      const smartAccount = new BiconomySmartAccount(config);
      await smartAccount.init();
      
      setSmartAccount(smartAccount);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SmartAccountContext.Provider value={{ smartAccount, loading, error }}>
      {children}
    </SmartAccountContext.Provider>
  );
}

export function useSmartAccountContext() {
  const context = useContext(SmartAccountContext);
  if (context === undefined) {
    throw new Error('useSmartAccountContext must be used within a SmartAccountProvider');
  }
  return context;
} 