"use client";

import { useCallback } from "react";
import { useApiBase } from './useApiBase';
import type { SponsorsApiResponse, SponsorsData } from '@/types';

/**
 * Hook for sponsors API operations using standardized patterns
 * 
 * @returns Object containing sponsors API methods and hooks
 */
export const useSponsorsApi = () => {
  // Query hook for sponsors data
  const useSponsorsData = () => {
    return useApiBase<SponsorsData>('/api/v1/sponsors/public', {
      autoFetch: true,
      requiresAuth: false, // Public endpoint
      defaultErrorMessage: 'Failed to fetch sponsors data'
    });
  };

  // Legacy method for backward compatibility
  const getSponsors = useCallback(async (): Promise<SponsorsApiResponse> => {
    const hook = useApiBase<SponsorsData>('/api/v1/sponsors/public', {
      requiresAuth: false
    });
    await hook.refetch();
    
    if (hook.error) {
      throw hook.error;
    }
    
    return {
      data: hook.data,
      success: !!hook.data,
    };
  }, []);

  return {
    // Query hook
    useSponsorsData,
    
    // Legacy method
    getSponsors,
  };
};
