"use client";

import { WagmiConfig, createConfig } from 'wagmi';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ChainProvider } from '@/contexts/ChainContext';

const { chains, publicClient } = configureChains(
  [mainnet, polygon],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Trading Bot Platform',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

const solanaEndpoint = "https://api.mainnet-beta.solana.com";
const wallets = [new PhantomWalletAdapter()];

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ConnectionProvider endpoint={solanaEndpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <ChainProvider>
                {children}
              </ChainProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
} 