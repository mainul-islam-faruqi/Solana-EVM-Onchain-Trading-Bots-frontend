import { BotStrategy } from '@/components/bot-builder/types';
import { TestResult } from '@/types/strategy';

export async function simulateStrategy(strategy: BotStrategy): Promise<TestResult[]> {
  // This is a mock implementation. In a real app, you'd:
  // 1. Fetch historical price data
  // 2. Run the strategy against this data
  // 3. Track trades, profits, and gas usage
  
  const results: TestResult[] = [];
  const now = Date.now();
  
  // Simulate a few test trades
  for (let i = 0; i < 5; i++) {
    const timestamp = now - (5 - i) * 60000; // 1 minute intervals
    const success = Math.random() > 0.3; // 70% success rate for demo
    
    results.push({
      timestamp,
      action: success ? 'BUY' : 'SELL',
      success,
      details: {
        price: 1800 + Math.random() * 100,
        amount: 0.1,
        gas: 0.002 + Math.random() * 0.001,
        error: success ? undefined : 'Insufficient liquidity'
      }
    });
  }
  
  return results;
} 