export interface PriceData {
  price: number;
  timestamp: number;
  source: 'chainlink' | 'pyth';
  confidence?: number;
  volume24h?: number;
  priceChange24h?: number;
}

export interface TokenConfig {
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  priceFeeds: {
    chainlink?: string;  // Chainlink feed address
    pyth?: string;      // Pyth price feed ID
  };
}

export interface HistoricalPrice {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d'; 