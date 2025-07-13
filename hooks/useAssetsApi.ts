'use client';

import { useState, useEffect, useRef } from 'react';
import { useApi } from './useApi';
import { useAuthStore } from '@/store/userStore';

interface AssetsData {
  assets: unknown[];
  // Add other asset-related fields as needed
}

interface UseAssetsApiReturn {
  data: AssetsData | null;
  isLoading: boolean;
  error: Error | null;
  refetchAssets: () => void;
  hasAssets: boolean;
}

export function useAssetsApi(): UseAssetsApiReturn {
  const { data: assetsResponse, request: fetchAssets, isLoading, error } = useApi();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [hasAssets, setHasAssets] = useState(false);
  const hasFetchedAssets = useRef(false);

  // Initial fetch when accessToken is available
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;
      
      try {
        await fetchAssets('/api/v1/assets', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        console.error('Failed to fetch assets:', err);
      }
    };

    if (accessToken && !hasFetchedAssets.current) {
      console.log('Fetching assets...');
      hasFetchedAssets.current = true;
      fetchData();
    }
  }, [accessToken, fetchAssets]);

  // Process response data
  useEffect(() => {
    if (assetsResponse) {
      if (assetsResponse.success && assetsResponse.data && assetsResponse.data.assets && assetsResponse.data.assets.length > 0) {
        setHasAssets(true);
      } else {
        setHasAssets(false);
      }
    }
  }, [assetsResponse]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Failed to fetch assets:', error);
      setHasAssets(false);
      hasFetchedAssets.current = false; // Reset flag on error to allow retry
    }
  }, [error]);

  // Manual refetch function
  const refetchAssets = async () => {
    if (!accessToken) return;
    
    hasFetchedAssets.current = false;
    hasFetchedAssets.current = true;
    
    try {
      await fetchAssets('/api/v1/assets', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Failed to fetch assets:', err);
    }
  };

  return {
    data: assetsResponse?.data || null,
    isLoading,
    error,
    refetchAssets,
    hasAssets,
  };
}