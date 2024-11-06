import { useEffect, useState } from 'react';
import { PriceData } from '@/lib/price-feeds/types';
import { priceService } from '@/lib/price-feeds/price-service';

export function usePriceData(tokenAddress: string, chainId: number) {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialPrice = async () => {
      try {
        const price = await priceService.getLatestPrice(tokenAddress, chainId);
        if (isMounted) {
          setPriceData(price);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch price'));
          setIsLoading(false);
        }
      }
    };

    const subscribeToUpdates = async () => {
      const unsubscribe = await priceService.subscribeToPrice(
        tokenAddress,
        chainId,
        (price) => {
          if (isMounted) {
            setPriceData(price);
          }
        }
      );

      return unsubscribe;
    };

    fetchInitialPrice();
    let unsubscribe: (() => void) | undefined;
    subscribeToUpdates().then(cleanup => {
      unsubscribe = cleanup;
    });

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [tokenAddress, chainId]);

  return { priceData, isLoading, error };
} 