'use client';

import { useCallback } from 'react';
import { useApiMutation, useApiBase, useFilteredApi } from '@/hooks/useApiBase';
import { useApi } from './useApi';
import type { 
  Transaction,
  TransactionListResponse,
  TransactionStats,
  CreateTransactionRequest,
  TransactionListFilters,
  PendingTransactionFilters
} from '@/types';

// Re-export types for backward compatibility
export type { Transaction, CreateTransactionRequest };

/**
 * Hook for transaction API operations with standardized patterns
 * 
 * @returns Object containing transaction API methods and hooks
 */
export const useTransactionApi = () => {
  const { request } = useApi();

  // Mutations
  const createTransactionMutation = useApiMutation<Transaction, CreateTransactionRequest>(
    '/api/v1/transaction/create',
    'POST',
    { defaultErrorMessage: 'Failed to create transaction' }
  );

  const cancelTransactionMutation = useApiMutation<void, { id: number }>(
    (variables) => `/api/v1/transaction/${variables.id}/cancel`,
    'POST',
    { defaultErrorMessage: 'Failed to cancel transaction' }
  );

  const executeTransactionMutation = useApiMutation<void, {
    id: number;
    execute_tx_hash: string;
  }>(
    (variables) => `/api/v1/transaction/${variables.id}/execute`,
    'POST',
    { defaultErrorMessage: 'Failed to execute transaction' }
  );

  const markTransactionFailedMutation = useApiMutation<void, {
    id: number;
    reason: string;
  }>(
    (variables) => `/api/v1/transaction/${variables.id}/mark-failed`,
    'POST',
    { defaultErrorMessage: 'Failed to mark transaction as failed' }
  );

  const retrySubmitTransactionMutation = useApiMutation<void, {
    id: number;
    tx_hash: string;
  }>(
    (variables) => `/api/v1/transaction/${variables.id}/retry-submit`,
    'POST',
    { defaultErrorMessage: 'Failed to retry transaction submission' }
  );

  // Query hooks
  const useTransactionList = (filters: Omit<TransactionListFilters, 'page' | 'page_size'> = {}) => {
    return useFilteredApi<TransactionListResponse, TransactionListFilters>(
      '/api/v1/transaction/list',
      { page: 1, page_size: 10, ...filters },
      { autoFetch: true, defaultErrorMessage: 'Failed to fetch transaction list' }
    );
  };

  const usePendingTransactions = (filters: Omit<PendingTransactionFilters, 'page' | 'page_size'> = {}) => {
    return useFilteredApi<TransactionListResponse, PendingTransactionFilters>(
      '/api/v1/transaction/pending',
      { page: 1, page_size: 10, ...filters },
      { autoFetch: true, defaultErrorMessage: 'Failed to fetch pending transactions' }
    );
  };

  const useTransactionStats = () => {
    return useApiBase<TransactionStats>('/api/v1/transaction/stats', {
      autoFetch: true,
      defaultErrorMessage: 'Failed to fetch transaction statistics'
    });
  };

  const useTransactionById = (id: number) => {
    return useApiBase<Transaction>(`/api/v1/transaction/${id}`, {
      autoFetch: true,
      defaultErrorMessage: 'Failed to fetch transaction details'
    });
  };

  // Convenience methods that wrap the mutations
  const createTransaction = useCallback(async (data: CreateTransactionRequest) => {
    return createTransactionMutation.mutate(data);
  }, [createTransactionMutation]);

  const cancelTransaction = useCallback(async (id: number) => {
    return cancelTransactionMutation.mutate({ id });
  }, [cancelTransactionMutation]);

  const executeTransaction = useCallback(async (id: number, executeData: { execute_tx_hash: string }) => {
    return executeTransactionMutation.mutate({
      id,
      execute_tx_hash: executeData.execute_tx_hash,
    });
  }, [executeTransactionMutation]);

  const markTransactionFailed = useCallback(async (id: number, reason: string) => {
    return markTransactionFailedMutation.mutate({ id, reason });
  }, [markTransactionFailedMutation]);

  const retrySubmitTransaction = useCallback(async (id: number, txHash: string) => {
    return retrySubmitTransactionMutation.mutate({ id, tx_hash: txHash });
  }, [retrySubmitTransactionMutation]);

  // Legacy methods for backward compatibility - using direct API calls
  const getTransactionList = useCallback(async (filters: TransactionListFilters): Promise<TransactionListResponse> => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
      
      const url = queryParams.toString() 
        ? `/api/v1/transaction/list?${queryParams.toString()}`
        : '/api/v1/transaction/list';
        
      const response = await request(url, { method: 'GET' });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, [request]);

  const getPendingTransactions = useCallback(async (filters: PendingTransactionFilters): Promise<TransactionListResponse> => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
      
      const url = queryParams.toString() 
        ? `/api/v1/transaction/pending?${queryParams.toString()}`
        : '/api/v1/transaction/pending';
        
      const response = await request(url, { method: 'GET' });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, [request]);

  const getTransactionStats = useCallback(async (): Promise<TransactionStats> => {
    try {
      const response = await request('/api/v1/transaction/stats', { method: 'GET' });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, [request]);

  const getTransactionById = useCallback(async (id: number): Promise<Transaction> => {
    try {
      const response = await request(`/api/v1/transaction/${id}`, { method: 'GET' });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, [request]);

  return {
    // Query hooks
    useTransactionList,
    usePendingTransactions,
    useTransactionStats,
    useTransactionById,
    
    // Mutation methods
    createTransaction,
    cancelTransaction,
    executeTransaction,
    markTransactionFailed,
    retrySubmitTransaction,
    
    // Legacy methods (for backward compatibility)
    getTransactionList,
    getPendingTransactions,
    getTransactionStats,
    getTransactionById,
    
    // Mutation states
    createTransactionState: {
      data: createTransactionMutation.data,
      error: createTransactionMutation.error,
      isLoading: createTransactionMutation.isLoading,
    },
    cancelTransactionState: {
      data: cancelTransactionMutation.data,
      error: cancelTransactionMutation.error,
      isLoading: cancelTransactionMutation.isLoading,
    },
    executeTransactionState: {
      data: executeTransactionMutation.data,
      error: executeTransactionMutation.error,
      isLoading: executeTransactionMutation.isLoading,
    },
  };
};