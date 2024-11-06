import { PriceData } from './types';

export async function getPythPriceData(feedId: string): Promise<PriceData> {
  try {
    // In production, this would connect to Pyth Network
    // For now, return mock data
    return {
      price: 1800 + Math.random() * 100,
      timestamp: Date.now(),
      source: 'pyth',
      confidence: 0.95,
      volume24h: 1000000,
      priceChange24h: -2.5
    };
  } catch (error) {
    throw new Error(`Failed to fetch Pyth price data: ${error}`);
  }
}

export async function setupPythWebSocket(feedId: string, onUpdate: (price: PriceData) => void) {
  // In production, this would set up WebSocket connection to Pyth Network
  // For now, simulate updates
  const interval = setInterval(() => {
    const mockPrice: PriceData = {
      price: 1800 + Math.random() * 100,
      timestamp: Date.now(),
      source: 'pyth',
      confidence: 0.95,
      volume24h: 1000000,
      priceChange24h: -2.5
    };
    onUpdate(mockPrice);
  }, 5000);

  return () => clearInterval(interval);
} 