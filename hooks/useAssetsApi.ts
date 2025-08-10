'use client';

import { useMemo } from 'react';
import { useApiBase } from './useApiBase';
import type { AssetsData, UseAssetsApiReturn } from '@/types';

/**
 * Hook for assets API operations using standardized patterns
 *
 * @returns Object containing assets data and utilities
 */
export function useAssetsApi(): UseAssetsApiReturn {
  const { data, error, isLoading, refetch } = useApiBase<AssetsData>('/api/v1/assets', {
    autoFetch: true,
    defaultErrorMessage: 'Failed to fetch assets',
  });

  // Compute derived state
  const hasAssets = useMemo(() => {
    return !!(data?.assets && data.assets.length > 0);
  }, [data]);

  return {
    data,
    isLoading,
    error,
    refetchAssets: refetch,
    hasAssets,
  };
}
