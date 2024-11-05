"use client";

import { useState, useEffect } from 'react';
import { useAccount as useWagmiAccount } from 'wagmi';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useChain } from '@/contexts/ChainContext';
import { WalletState } from '@/types/wallet';
import { useBalance } from 'wagmi';
import { Connection } from '@solana/web3.js';

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

export function useWalletConnection() {
  const { selectedChain } = useChain();
  const [walletState, setWalletState] = useState<WalletState>({
    evmWallet: null,
    solanaWallet: null,
    isConnecting: false,
    error: null,
  });

  // EVM wallet connection
  const { address: evmAddress, isConnected: isEvmConnected } = useWagmiAccount();
  const { data: evmBalance } = useBalance({
    address: evmAddress,
  });

  // Solana wallet connection
  const { publicKey: solanaAddress, connected: isSolanaConnected } = useSolanaWallet();
  const [solanaBalance, setSolanaBalance] = useState<string | null>(null);

  // Fetch Solana balance
  useEffect(() => {
    async function fetchSolanaBalance() {
      if (solanaAddress) {
        try {
          const connection = new Connection(SOLANA_RPC);
          const balance = await connection.getBalance(solanaAddress);
          setSolanaBalance((balance / 1e9).toString()); // Convert lamports to SOL
        } catch (error) {
          console.error('Error fetching Solana balance:', error);
        }
      }
    }

    if (isSolanaConnected && solanaAddress) {
      fetchSolanaBalance();
    }
  }, [solanaAddress, isSolanaConnected]);

  // Update wallet state
  useEffect(() => {
    setWalletState(prev => ({
      ...prev,
      evmWallet: isEvmConnected && evmAddress ? {
        address: evmAddress,
        balance: evmBalance?.formatted,
        network: evmBalance?.symbol,
      } : null,
      solanaWallet: isSolanaConnected && solanaAddress ? {
        address: solanaAddress.toString(),
        balance: solanaBalance || '0',
        network: 'SOL',
      } : null,
    }));
  }, [evmAddress, isEvmConnected, evmBalance, solanaAddress, isSolanaConnected, solanaBalance]);

  const isConnected = selectedChain === 'EVM' ? isEvmConnected : isSolanaConnected;
  const currentWallet = selectedChain === 'EVM' ? walletState.evmWallet : walletState.solanaWallet;

  return {
    isConnected,
    currentWallet,
    walletState,
    selectedChain,
  };
} 