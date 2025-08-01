'use client';

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useActiveAccount } from 'thirdweb/react';
import { toast } from 'sonner';
import { useWeb3React } from '@/hooks/useWeb3React';

// Compound Timelock ABI (basic signatures)
const COMPOUND_TIMELOCK_ABI = [
  'function admin() view returns (address)',
  'function pendingAdmin() view returns (address)',
  'function delay() view returns (uint256)',
  'function GRACE_PERIOD() view returns (uint256)',
  'function MINIMUM_DELAY() view returns (uint256)',
  'function MAXIMUM_DELAY() view returns (uint256)',
];

export interface TimelockParameters {
  isValid: boolean;
  standard: 'compound' | null;
  contractAddress: string;
  minDelay: number;
  admin?: string;
  pendingAdmin?: string;
}

export interface ImportTimelockRequest {
  chain_id: number;
  chain_name: string;
  contract_address: string;
  standard: 'compound';
  min_delay: number;
  remark: string;
  admin?: string;
  pending_admin?: string;
}

export const useTimelockImport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [parameters, setParameters] = useState<TimelockParameters | null>(null);
  const { address: walletAddress } = useActiveAccount() || {};
  const { provider } = useWeb3React();
  /**
   * Detect timelock standard by checking contract functions
   * Only supports Compound now
   */
  const detectTimelockStandard = async (contractAddress: string): Promise<'compound' | null> => {
    try {
      const code = await provider.getCode(contractAddress);
      if (code === '0x') {
        return null;
      }
      try {
        const compoundContract = new ethers.Contract(contractAddress, COMPOUND_TIMELOCK_ABI, provider);
        await compoundContract.admin();
        await compoundContract.delay();
        return 'compound';
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  };

  /**
   * Get Compound timelock parameters
   */
  const getCompoundParameters = async (contractAddress: string): Promise<Partial<TimelockParameters>> => {
    const contract = new ethers.Contract(contractAddress, COMPOUND_TIMELOCK_ABI, provider);
    try {
      const [admin, pendingAdmin, delay] = await Promise.all([
        contract.admin(),
        contract.pendingAdmin(),
        contract.delay(),
      ]);
      return {
        admin,
        pendingAdmin: pendingAdmin === ethers.constants.AddressZero ? undefined : pendingAdmin,
        minDelay: delay.toNumber(),
      };
    } catch (error) {
      console.error('Error getting Compound parameters:', error);
      throw error;
    }
  };

  /**
   * Fetch timelock parameters from blockchain
   */
  const fetchTimelockParameters = useCallback(async (contractAddress: string): Promise<TimelockParameters> => {
    if (!ethers.utils.isAddress(contractAddress)) {
      throw new Error('Invalid contract address');
    }
    setIsLoading(true);
    try {
      const standard = await detectTimelockStandard(contractAddress);
      if (!standard) {
        throw new Error('Contract is not a valid Compound timelock');
      }
      const params = await getCompoundParameters(contractAddress);
      const result: TimelockParameters = {
        isValid: true,
        standard,
        contractAddress,
        minDelay: params.minDelay || 0,
        ...params,
      };
      setParameters(result);
      return result;
    } catch (error) {
      console.error('Error fetching timelock parameters:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch timelock parameters';
      toast.error(errorMessage);
      const result: TimelockParameters = {
        isValid: false,
        standard: null,
        contractAddress,
        minDelay: 0,
      };
      setParameters(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  /**
   * Clear stored parameters
   */
  const clearParameters = useCallback(() => {
    setParameters(null);
  }, []);

  /**
   * Validate contract address
   */
  const validateContractAddress = useCallback(async (address: string): Promise<boolean> => {
    try {
      if (!ethers.utils.isAddress(address)) return false;
      const code = await provider.getCode(address);
      return code !== '0x';
    } catch (error) {
      alert(error);
      console.error('Error validating contract address:', error);
      return false;
    }
  }, [provider]);

  return {
    isLoading,
    parameters,
    fetchTimelockParameters,
    clearParameters,
    validateContractAddress,
  };
};
