import { PublicKey } from '@solana/web3.js';
import { TOKEN_MINTS } from '../solana/constants';

export interface TokenInfo {
  symbol: string;
  mint: string;
}

export const TRADING_PAIRS = [
  {
    id: 'USDC-SOL',
    name: 'USDC/SOL',
    inputToken: {
      symbol: 'USDC',
      mint: TOKEN_MINTS.USDC,
    },
    outputToken: {
      symbol: 'SOL',
      mint: TOKEN_MINTS.SOL,
    }
  },
  {
    id: 'USDT-SOL',
    name: 'USDT/SOL',
    inputToken: {
      symbol: 'USDT',
      mint: TOKEN_MINTS.USDT,
    },
    outputToken: {
      symbol: 'SOL',
      mint: TOKEN_MINTS.SOL,
    }
  }
]; 