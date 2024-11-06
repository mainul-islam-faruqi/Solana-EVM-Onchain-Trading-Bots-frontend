import { ethers } from 'ethers';
import { PriceData, TokenConfig, HistoricalPrice, TimeFrame } from './types';
import { CHAINLINK_ABI } from './abis/chainlink';
import { getPythPriceData, setupPythWebSocket } from './pyth-service';

export class PriceService {
  private providers: Map<number, ethers.Provider>;
  private tokenConfigs: Map<string, TokenConfig>;
  private priceSubscriptions: Map<string, any>;
  private listeners: Map<string, Set<(price: PriceData) => void>>;

  constructor() {
    this.providers = new Map();
    this.tokenConfigs = new Map();
    this.priceSubscriptions = new Map();
    this.listeners = new Map();
  }

  async initialize(tokens: TokenConfig[]) {
    // Initialize providers and token configs
    tokens.forEach(token => {
      this.tokenConfigs.set(`${token.chainId}-${token.address}`, token);
    });
  }

  async getLatestPrice(tokenAddress: string, chainId: number): Promise<PriceData> {
    const key = `${chainId}-${tokenAddress}`;
    const config = this.tokenConfigs.get(key);
    if (!config) throw new Error('Token not configured');

    if (chainId === 1 || chainId === 137) { // Ethereum or Polygon
      return this.getChainlinkPrice(config);
    } else {
      return this.getPythPrice(config);
    }
  }

  async subscribeToPrice(
    tokenAddress: string,
    chainId: number,
    callback: (price: PriceData) => void
  ): Promise<() => void> {
    const key = `${chainId}-${tokenAddress}`;
    
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key)!.add(callback);

    // Set up real-time subscription
    if (!this.priceSubscriptions.has(key)) {
      await this.setupPriceSubscription(key);
    }

    // Return cleanup function
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.cleanupSubscription(key);
        }
      }
    };
  }

  async getHistoricalPrices(
    tokenAddress: string,
    chainId: number,
    timeframe: TimeFrame,
    startTime: number,
    endTime: number
  ): Promise<HistoricalPrice[]> {
    // Implement historical price fetching logic
    return [];
  }

  private async getChainlinkPrice(config: TokenConfig): Promise<PriceData> {
    const provider = await this.getProvider(config.chainId);
    const feedAddress = config.priceFeeds.chainlink;
    if (!feedAddress) throw new Error('Chainlink feed not configured');

    const priceFeed = new ethers.Contract(feedAddress, CHAINLINK_ABI, provider);
    const [roundData, decimals] = await Promise.all([
      priceFeed.latestRoundData(),
      priceFeed.decimals()
    ]);

    return {
      price: parseFloat(ethers.formatUnits(roundData.answer, decimals)),
      timestamp: roundData.updatedAt.toNumber(),
      source: 'chainlink'
    };
  }

  private async getPythPrice(config: TokenConfig): Promise<PriceData> {
    const feedId = config.priceFeeds.pyth;
    if (!feedId) throw new Error('Pyth feed not configured');

    return getPythPriceData(feedId);
  }

  private async setupPriceSubscription(key: string) {
    const config = this.tokenConfigs.get(key);
    if (!config) return;

    if (config.priceFeeds.chainlink) {
      await this.setupChainlinkSubscription(key, config);
    } else if (config.priceFeeds.pyth) {
      await this.setupPythSubscription(key, config);
    }
  }

  private async setupChainlinkSubscription(key: string, config: TokenConfig) {
    const provider = await this.getProvider(config.chainId);
    const feedAddress = config.priceFeeds.chainlink!;
    
    const priceFeed = new ethers.Contract(feedAddress, CHAINLINK_ABI, provider);
    
    priceFeed.on('AnswerUpdated', async (answer, roundId) => {
      const decimals = await priceFeed.decimals();
      const price: PriceData = {
        price: parseFloat(ethers.formatUnits(answer, decimals)),
        timestamp: Date.now(),
        source: 'chainlink'
      };

      this.notifyListeners(key, price);
    });

    this.priceSubscriptions.set(key, priceFeed);
  }

  private async setupPythSubscription(key: string, config: TokenConfig) {
    const cleanup = await setupPythWebSocket(
      config.priceFeeds.pyth!,
      (price: PriceData) => {
        this.notifyListeners(key, price);
      }
    );

    // Store cleanup function
    const subscription = {
      removeAllListeners: cleanup
    };
    this.priceSubscriptions.set(key, subscription as any);
  }

  private cleanupSubscription(key: string) {
    const subscription = this.priceSubscriptions.get(key);
    if (subscription) {
      subscription.removeAllListeners();
      this.priceSubscriptions.delete(key);
    }
  }

  private async getProvider(chainId: number): Promise<ethers.Provider> {
    if (!this.providers.has(chainId)) {
      // Initialize provider based on chain ID
      const provider = ethers.getDefaultProvider(
        chainId === 137 ? process.env.NEXT_PUBLIC_POLYGON_RPC : undefined
      );
      this.providers.set(chainId, provider);
    }
    return this.providers.get(chainId)!;
  }

  private notifyListeners(key: string, price: PriceData) {
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => callback(price));
    }
  }
}

// Export singleton instance
export const priceService = new PriceService(); 