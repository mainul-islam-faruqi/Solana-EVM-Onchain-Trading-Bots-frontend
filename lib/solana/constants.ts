import { PublicKey } from '@solana/web3.js';

export const PROGRAM_IDS = {
  TRADING_BOT: new PublicKey('3seUuDx9nQXF18sEtcyZBkrf4YQjxHJuYFS26JVn1ERK'),
  JUPITER_DCA: new PublicKey('JUPaCzg2UYqiJ4UqWHTqYMHGzqrBF9sQW3dqsUuBxwj'),
} as const;

export const ACCOUNTS = {
  JUPITER_DCA: new PublicKey('DC2mkgwhy56w3viNtHDjJQmc7SGu2QX785bS4aexojwX'),
} as const;

export const TOKEN_MINTS = {
  USDC: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  USDT: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
  SOL: new PublicKey('So11111111111111111111111111111111111111112'),
  BONK: new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
} as const;

export const SEEDS = {
  ESCROW: 'escrow',
  AUTHORITY: 'authority',
} as const; 