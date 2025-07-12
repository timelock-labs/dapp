'use client';

import { useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';

// Transaction data types based on API documentation
export interface Transaction {
  id: number;
  chain_id: number;
  chain_name: string;
  created_at: string;
  creator_address: string;
  description: string;
  eta: number;
  executed_at?: string;
  canceled_at?: string;
  queued_at?: string;
  function_sig: string;
  operation_id: string;
  status: 'submitting' | 'queued' | 'ready' | 'executing' | 'executed' | 'expired' | 'canceled' | 'failed' | 'submit_failed';
  status_message: string;
  target: string;
  time_remaining: number;
  timelock_address: string;
  timelock_standard: 'compound' | 'openzeppelin';
  timelock_info?: string;
  tx_data: string;
  tx_hash: string;
  updated_at: string;
  user_permissions: string[];
  value: string;
  can_cancel: boolean;
  can_execute: boolean;
  can_retry_submit: boolean;
}

export interface TransactionListResponse {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  transactions: Transaction[];
}

export interface TransactionStats {
  canceled_count: number;
  executed_count: number;
  executing_count: number;
  expired_count: number;
  failed_count: number;
  queued_count: number;
  ready_count: number;
  submit_failed_count: number;
  submitting_count: number;
  total_transactions: number;
}

export interface CreateTransactionRequest {
  chain_id: number;
  chain_name: string;
  description: string;
  eta: number;
  function_sig: string;
  operation_id: string;
  target: string;
  timelock_address: string;
  timelock_standard: 'compound' | 'openzeppelin';
  tx_data: string;
  tx_hash: string;
  value: string;
}

export interface TransactionListFilters {
  chain_id?: number;
  timelock_address?: string;
  timelock_standard?: 'compound' | 'openzeppelin';
  status?: string;
  page: number;
  page_size: number;
}

export interface PendingTransactionFilters {
  chain_id?: number;
  only_can_exec?: boolean;
  page: number;
  page_size: number;
}

export const useTransactionApi = () => {
  const { request } = useApi();
  const accessToken = useAuthStore((state) => state.accessToken);

  const createHeaders = useCallback(() => ({
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }), [accessToken]);

  // Create new transaction
  const createTransaction = useCallback(async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await request('/api/v1/transaction/create', {
      method: 'POST',
      headers: createHeaders(),
      body: data,
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to create transaction');
    }

    return response.data;
  }, [request, createHeaders]);

  // Get transaction list with filters
  const getTransactionList = useCallback(async (filters: TransactionListFilters): Promise<TransactionListResponse> => {
    const params = new URLSearchParams();
    params.append('page', filters.page.toString());
    params.append('page_size', filters.page_size.toString());
    
    if (filters.chain_id) params.append('chain_id', filters.chain_id.toString());
    if (filters.timelock_address) params.append('timelock_address', filters.timelock_address);
    if (filters.timelock_standard) params.append('timelock_standard', filters.timelock_standard);
    if (filters.status) params.append('status', filters.status);

    const response = await request(`/api/v1/transaction/list?${params.toString()}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to fetch transaction list');
    }

    return response.data;
  }, [request, createHeaders]);

  // Get pending transactions
  const getPendingTransactions = useCallback(async (filters: PendingTransactionFilters): Promise<TransactionListResponse> => {
    const params = new URLSearchParams();
    params.append('page', filters.page.toString());
    params.append('page_size', filters.page_size.toString());
    
    if (filters.chain_id) params.append('chain_id', filters.chain_id.toString());
    if (filters.only_can_exec !== undefined) params.append('only_can_exec', filters.only_can_exec.toString());

    const response = await request(`/api/v1/transaction/pending?${params.toString()}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to fetch pending transactions');
    }

    return response.data;
  }, [request, createHeaders]);

  // Get transaction statistics
  const getTransactionStats = useCallback(async (): Promise<TransactionStats> => {
    const response = await request('/api/v1/transaction/stats', {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to fetch transaction stats');
    }

    return response.data;
  }, [request, createHeaders]);

  // Get transaction details by ID
  const getTransactionById = useCallback(async (id: number): Promise<Transaction> => {
    const response = await request(`/api/v1/transaction/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to fetch transaction details');
    }

    return response.data;
  }, [request, createHeaders]);

  // Cancel transaction
  const cancelTransaction = useCallback(async (id: number): Promise<void> => {
    const response = await request(`/api/v1/transaction/${id}/cancel`, {
      method: 'POST',
      headers: createHeaders(),
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to cancel transaction');
    }
  }, [request, createHeaders]);

  // Execute transaction
  const executeTransaction = useCallback(async (id: number, executeData: { execute_tx_hash: string; id: number }): Promise<void> => {
    const response = await request(`/api/v1/transaction/${id}/execute`, {
      method: 'POST',
      headers: createHeaders(),
      body: executeData,
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to execute transaction');
    }
  }, [request, createHeaders]);

  // Mark transaction as failed
  const markTransactionFailed = useCallback(async (id: number, reason: string): Promise<void> => {
    const response = await request(`/api/v1/transaction/${id}/mark-failed`, {
      method: 'POST',
      headers: createHeaders(),
      body: { id, reason },
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to mark transaction as failed');
    }
  }, [request, createHeaders]);

  // Mark transaction submit as failed
  const markTransactionSubmitFailed = useCallback(async (id: number, reason: string): Promise<void> => {
    const response = await request(`/api/v1/transaction/${id}/mark-submit-failed`, {
      method: 'POST',
      headers: createHeaders(),
      body: { id, reason },
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to mark transaction submit as failed');
    }
  }, [request, createHeaders]);

  // Retry submit transaction
  const retrySubmitTransaction = useCallback(async (id: number, txHash: string): Promise<void> => {
    const response = await request(`/api/v1/transaction/${id}/retry-submit`, {
      method: 'POST',
      headers: createHeaders(),
      body: { id, tx_hash: txHash },
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to retry submit transaction');
    }
  }, [request, createHeaders]);

  return {
    createTransaction,
    getTransactionList,
    getPendingTransactions,
    getTransactionStats,
    getTransactionById,
    cancelTransaction,
    executeTransaction,
    markTransactionFailed,
    markTransactionSubmitFailed,
    retrySubmitTransaction,
  };
};