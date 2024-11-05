import { PhantomWallet } from '@solana/wallet-adapter-phantom';
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    solana?: PhantomWallet;
  }
} 