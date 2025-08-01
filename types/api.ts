/**
 * API-related types and interfaces
 */

import type { HttpMethod, PaginationResponse, ContractStandard, TransactionStatus, Address, Hash, Timestamp, ID } from './common';

/**
 * Generic API error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T | null;
  success: boolean;
  error?: ApiError;
}

/**
 * API request options
 */
export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Hook return type for API operations
 */
export interface UseApiReturn {
  data: ApiResponse;
  error: Error | null;
  isLoading: boolean;
  request: (url: string, options?: ApiRequestOptions, retryCount?: number) => Promise<any>;
}

/**
 * User data structure
 */
export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: Address;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  expiresAt: number | null;
}

/**
 * Chain information
 */
export interface Chain {
  id: number;
  chain_id: number;
  chain_name: string;
  display_name: string;
  logo_url: string;
  native_token: string;
  is_testnet: boolean;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/**
 * Chain API response
 */
export interface ChainApiResponse extends ApiResponse<Chain> {}

/**
 * Timelock contract data
 */
export interface TimelockContract {
  id: number;
  chain_name: string;
  contract_address: Address;
  admin?: Address;
  created_at: Timestamp;
  remark: string;
  status: string;
  standard: ContractStandard;
  // OpenZeppelin specific fields
  proposers?: string;
  executors?: string;
  cancellers?: string;
  // Compound specific fields
  pending_admin?: Address;
}

/**
 * Timelock parameters for import/validation
 */
export interface TimelockParameters {
  isValid: boolean;
  standard: ContractStandard | null;
  contractAddress: Address;
  minDelay: number;
  admin?: Address;
  pendingAdmin?: Address;
}

/**
 * Import timelock request
 */
export interface ImportTimelockRequest {
  chain_id: number;
  chain_name: string;
  contract_address: Address;
  standard: ContractStandard;
  min_delay: number;
  remark: string;
  admin?: Address;
  pending_admin?: Address;
}

/**
 * Create timelock request
 */
export interface CreateTimelockRequestBody {
  chain_id: number;
  chain_name: string;
  min_delay: number;
  remark: string;
  standard: ContractStandard;
  tx_hash: Hash;
  contract_address: Address;
  admin?: Address;
}

/**
 * Timelock API response
 */
export interface TimelockApiResponse extends ApiResponse<any> {}

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
  ready_count: number;
  submit_failed_count: number;
  submitting_count: number;
  total_transactions: number;
}

/**
 * Create transaction request
 */
export interface CreateTransactionRequest {
  chain_id: number;
  chain_name: string;
  description: string;
  eta: number;
  function_sig: string;
  operation_id: string;
  target: Address;
  timelock_address: Address;
  timelock_standard: ContractStandard;
  tx_data: string;
  tx_hash: Hash;
  value: string;
}

/**
 * Transaction list filters
 */
export interface TransactionListFilters {
  chain_id?: number;
  timelock_address?: Address;
  timelock_standard?: ContractStandard;
  status?: string;
  page: number;
  page_size: number;
}

/**
 * Pending transaction filters
 */
export interface PendingTransactionFilters {
  chain_id?: number;
  only_can_exec?: boolean;
  page: number;
  page_size: number;
}

/**
 * ABI item data
 */
export interface ABIItem {
  id: number;
  name: string;
  description: string;
  abi_content: string;
  owner: string;
  is_shared: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/**
 * ABI list response
 */
export interface ABIListResponse extends ApiResponse {
  data: {
    shared_abis: ABIItem[];
    user_abis: ABIItem[];
  };
}

/**
 * Email notification data
 */
export interface EmailNotification {
  created_at: Timestamp;
  email: string;
  email_remark: string;
  id: number;
  is_active: boolean;
  is_verified: boolean;
  timelock_contracts: string[];
  updated_at: Timestamp;
}

/**
 * Email notification list response
 */
export interface EmailNotificationListResponse extends PaginationResponse {
  items: EmailNotification[];
}

/**
 * Email log data
 */
export interface EmailLog {
  created_at: Timestamp;
  email: string;
  event_type: string;
  id: number;
  is_emergency: boolean;
  is_replied: boolean;
  replied_at: Timestamp;
  send_status: string;
  sent_at: Timestamp;
  subject: string;
  timelock_address: Address;
  transaction_hash: Hash;
}

/**
 * Create email notification request
 */
export interface CreateEmailNotificationRequest {
  email: string;
  email_remark: string;
  timelock_contracts: string[];
}

/**
 * Update email notification request
 */
export interface UpdateEmailNotificationRequest {
  email_remark: string;
  timelock_contracts: string[];
}

/**
 * Verify email request
 */
export interface VerifyEmailRequest {
  email: string;
  verification_code: string;
}

/**
 * Resend code request
 */
export interface ResendCodeRequest {
  email: string;
}

/**
 * Emergency reply request
 */
export interface EmergencyReplyRequest {
  token: string;
}

/**
 * Email notification filters
 */
export interface EmailNotificationFilters {
  page?: number;
  page_size?: number;
}

/**
 * Partner/Sponsor data
 */
export interface Partner {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  link: string;
  sort_order: number;
  type: string;
}

/**
 * Sponsors data
 */
export interface SponsorsData {
  sponsors: Partner[];
  partners: Partner[];
}

/**
 * Sponsors API response
 */
export interface SponsorsApiResponse extends ApiResponse<SponsorsData> {}

/**
 * Assets data
 */
export interface AssetsData {
  assets: unknown[];
  // Add other asset-related fields as needed
}

/**
 * Assets API return type
 */
export interface UseAssetsApiReturn {
  data: AssetsData | null;
  isLoading: boolean;
  error: Error | null;
  refetchAssets: () => void;
  hasAssets: boolean;
}