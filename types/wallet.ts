export interface WalletInfo {
  address: string;
  chainId?: number;
  balance?: string;
  network?: string;
}

export interface WalletState {
  evmWallet: WalletInfo | null;
  solanaWallet: WalletInfo | null;
  isConnecting: boolean;
  error: string | null;
} 