'use client';

import { useCallback } from 'react';
import { useApiMutation, useApiBase, useFilteredApi } from '@/hooks/useApiBase';
import { useApi } from './useApi';
import type {
  Transaction,
  TransactionListResponse,
  TransactionStats,
  TransactionListFilters,
  PendingTransactionFilters,
} from '@/types';

// Re-export types for backward compatibility
export type { Transaction };

/**
 * Hook for transaction API operations with standardized patterns
 *
 * @returns Object containing transaction API methods and hooks
 */
export const useTransactionApi = () => {
  const { request } = useApi();

  // Legacy methods for backward compatibility - using direct API calls
  const getTransactionList = useCallback(
    async (filters: TransactionListFilters): Promise<TransactionListResponse> => {
      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
          }
        });

        const url = queryParams.toString()
          ? `/api/v1/flows/list?${queryParams.toString()}`
          : '/api/v1/flows/list';

        const response = await request(url, { method: 'GET' });
        return response.data.flows || response.data; // Handle both legacy and new response formats
      } catch (error) {
        throw error;
      }
    },
    [request]
  );

  const getPendingTransactions = useCallback(
    async (filters: PendingTransactionFilters): Promise<TransactionListResponse> => {
      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
          }
        });

        const url = queryParams.toString()
          ? `/api/v1/flows/list?${queryParams.toString()}`
          : '/api/v1/flows/list';

        const response = await request(url, { method: 'GET' });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    [request]
  );

  const getTransactionStats = useCallback(async (): Promise<TransactionStats> => {
    try {
      const response = await request('/api/v1/flows/stats', { method: 'GET' });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, [request]);

  const getTransactionById = useCallback(
    async (id: number): Promise<Transaction> => {
      try {
        const response = await request(`/api/v1/flows/${id}`, { method: 'GET' });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    [request]
  );

  return {
    // Legacy methods (for backward compatibility)
    getTransactionList,
    getPendingTransactions,
    getTransactionStats,
    getTransactionById,
  };
};
