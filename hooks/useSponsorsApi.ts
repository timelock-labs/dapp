"use client";

import { useCallback } from "react";
import { useApiBase } from './useApiBase';
import { useApi } from './useApi';
import type { SponsorsApiResponse, SponsorsData } from '@/types';

/**
 * Hook for sponsors API operations using standardized patterns
 * 
 * @returns Object containing sponsors API methods and hooks
 */
export const useSponsorsApi = () => {
  const { request } = useApi();

  // Query hook for sponsors data
  const useSponsorsData = () => {
    return useApiBase<SponsorsData>('/api/v1/sponsors/public', {
      autoFetch: true,
      requiresAuth: false, // Public endpoint
      defaultErrorMessage: 'Failed to fetch sponsors data'
    });
  };

  // Legacy method for backward compatibility - using direct API call
  const getSponsors = useCallback(async (): Promise<SponsorsApiResponse> => {
    try {
      const response = await request('/api/v1/sponsors/public', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      return {
        data: response.data,
        success: response.success,
      };
    } catch (error) {
      throw error;
    }
  }, [request]);

  return {
    // Query hook
    useSponsorsData,
    
    // Legacy method
    getSponsors,
  };
};
