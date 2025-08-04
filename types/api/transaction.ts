/**
 * Transaction-related API types
 */

import type { Address, Hash, Timestamp, TransactionStatus, ContractStandard, PaginationResponse } from '../common';

/**
 * Transaction data
 */
export interface Transaction {
  id: number;
  chain_id: number;
  chain_name: string;
  created_at: Timestamp;
  creator_address: Address;
  description: string;
  eta: number;
  executed_at?: Timestamp;
  canceled_at?: Timestamp;
  queued_at?: Timestamp;
  function_sig: string;
  operation_id: string;
  status: TransactionStatus;
  status_message: string;
  target: Address;
  time_remaining: number;
  timelock_address: Address;
  timelock_standard: ContractStandard;
  timelock_info?: string;
  tx_data: string;
  tx_hash: Hash;
  updated_at: Timestamp;
  user_permissions: string[];
  value: string;
  can_cancel: boolean;
  can_execute: boolean;
  can_retry_submit: boolean;
}

/**
 * Transaction list response
 */
export interface TransactionListResponse extends PaginationResponse {
  transactions: Transaction[];
}

/**
 * Transaction statistics
 */
export interface TransactionStats {
  canceled_count: number;
  executed_count: number;
  executing_count: number;
  expired_count: number;
  failed_count: number;
  queued_count: number;
  total_count: number;
}

/**
 * Create transaction request
 */
export interface CreateTransactionRequest {
  chain_id: number;
  chain_name: string;
  timelock_address: Address;
  timelock_standard: ContractStandard;
  target: Address;
  value: string;
  function_sig: string;
  tx_data: string;
  description: string;
  eta: number;
  operation_id: string;
  tx_hash: Hash;
}

/**
 * Transaction list filters
 */
export interface TransactionListFilters {
  chain_id?: number;
  timelock_address?: Address;
  status?: TransactionStatus;
  search?: string;
  page?: number;
  page_size?: number;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Pending transaction filters
 */
export interface PendingTransactionFilters {
  chain_id?: number;
  timelock_address?: Address;
  page?: number;
  page_size?: number;
  [key: string]: string | number | boolean | undefined;
}