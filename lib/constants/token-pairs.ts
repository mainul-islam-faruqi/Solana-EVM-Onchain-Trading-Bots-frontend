import { PublicKey } from '@solana/web3.js';

export interface TokenInfo {
  symbol: string;
  name: string;
  mint: PublicKey;
  decimals: number;
}

export const SOLANA_TOKENS = {
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    mint: new PublicKey('So11111111111111111111111111111111111111112'),
    decimals: 9
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    decimals: 6
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    mint: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
    decimals: 6
  },
  // Add more tokens as needed
} as const;

export const AVAILABLE_PAIRS = [
  {
    inputToken: SOLANA_TOKENS.USDC,
    outputToken: SOLANA_TOKENS.SOL,
  },
  {
    inputToken: SOLANA_TOKENS.USDT,
    outputToken: SOLANA_TOKENS.SOL,
  },
  {
    inputToken: SOLANA_TOKENS.SOL,
    outputToken: SOLANA_TOKENS.USDC,
  },
  // Add more pairs as needed
]; 