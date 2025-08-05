/**
 * Timelock-related API types
 */

import type { Address, Hash, Timestamp, ContractStandard } from '../common';
import type { ApiResponse } from './base';

/**
 * Timelock contract data
 */
export interface TimelockContract {
  compound_timelocks: TimelockContractItem[];
  openzeppelin_timelocks: TimelockContractItem[];
  total: number;
}

/**
 * Timelock contract data
 */
export interface TimelockContractItem {
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
  // Compound specific fields
  gracePeriod?: number;
  minimumDelay?: number;
  maximumDelay?: number;
  // Error field for validation failures
  error?: string;
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