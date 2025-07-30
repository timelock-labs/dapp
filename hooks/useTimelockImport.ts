'use client';

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useActiveAccount } from 'thirdweb/react';
import { toast } from 'sonner';

// Compound Timelock ABI (basic signatures)
const COMPOUND_TIMELOCK_ABI = [
  'function admin() view returns (address)',
  'function pendingAdmin() view returns (address)', 
  'function delay() view returns (uint256)',
  'function GRACE_PERIOD() view returns (uint256)',
  'function MINIMUM_DELAY() view returns (uint256)',
  'function MAXIMUM_DELAY() view returns (uint256)',
];

// OpenZeppelin TimelockController ABI (simplified)
const OPENZEPPELIN_TIMELOCK_ABI = [
  'function getMinDelay() view returns (uint256)',
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function getRoleAdmin(bytes32 role) view returns (bytes32)',
  'function getRoleMember(bytes32 role, uint256 index) view returns (address)',
  'function getRoleMemberCount(bytes32 role) view returns (uint256)',
];

// OpenZeppelin Role constants
const TIMELOCK_ADMIN_ROLE = '0x5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5';
const PROPOSER_ROLE = '0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1';
const EXECUTOR_ROLE = '0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63';
const CANCELLER_ROLE = '0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783';

export interface TimelockParameters {
  isValid: boolean;
  standard: 'compound' | 'openzeppelin' | null;
  contractAddress: string;
  minDelay: number;
  
  // Compound specific
  admin?: string;
  pendingAdmin?: string;
  
  // OpenZeppelin specific
  proposers?: string[];
  executors?: string[];
  cancellers?: string[];
}

export interface ImportTimelockRequest {
  chain_id: number;
  chain_name: string;
  contract_address: string;
  standard: 'compound' | 'openzeppelin';
  min_delay: number;
  remark: string;
  
  // Compound specific
  admin?: string;
  pending_admin?: string;
  
  // OpenZeppelin specific
  proposers?: string[];
  executors?: string[];
  cancellers?: string[];
}

export const useTimelockImport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [parameters, setParameters] = useState<TimelockParameters | null>(null);
  const { address: walletAddress } = useActiveAccount() || {};

  /**
   * Get role members for OpenZeppelin timelock
   */
  const getRoleMembers = async (contract: ethers.Contract, role: string): Promise<string[]> => {
    try {
      const memberCount = await contract.getRoleMemberCount(role);
      const members: string[] = [];
      
      for (let i = 0; i < memberCount.toNumber(); i++) {
        const member = await contract.getRoleMember(role, i);
        members.push(member);
      }
      
      return members;
    } catch (error) {
      console.error(`Error getting role members for ${role}:`, error);
      return [];
    }
  };

  /**
   * Detect timelock standard by checking contract functions
   */
  const detectTimelockStandard = async (contractAddress: string): Promise<'compound' | 'openzeppelin' | null> => {
    if (!sdk) {
      console.log('SDK not available');
      return null;
    }
    
    try {
      const provider = sdk.getProvider();
      console.log('Provider obtained:', provider);
      
      // Check network
      const network = await provider.getNetwork();
      console.log('Current network:', network.chainId, network.name);
      
      // First check if it's a valid contract
      console.log('Checking contract code at:', contractAddress);
      const code = await provider.getCode(contractAddress);
      console.log('Contract code length:', code.length, 'Code preview:', code.substring(0, 20));
      
      if (code === '0x') {
        console.log('Address is not a contract');
        return null;
      }
      
      // Try Compound first - test multiple functions for better detection
      console.log('Attempting Compound timelock detection...');
      try {
        const compoundContract = new ethers.Contract(contractAddress, COMPOUND_TIMELOCK_ABI, provider);
        console.log('Compound contract instance created');
        
        // Try calling admin() first
        console.log('Calling admin() function...');
        const admin = await compoundContract.admin();
        console.log('Admin call successful:', admin);
        
        // Try calling delay()
        console.log('Calling delay() function...');
        const delay = await compoundContract.delay();
        console.log('Delay call successful:', delay.toString());
        
        console.log('Compound timelock detected:', { admin, delay: delay.toString() });
        return 'compound';
      } catch (error) {
        console.log('Compound detection failed:', error);
        console.error('Compound error details:', error);
      }
      
      // Try OpenZeppelin
      console.log('Attempting OpenZeppelin timelock detection...');
      try {
        const ozContract = new ethers.Contract(contractAddress, OPENZEPPELIN_TIMELOCK_ABI, provider);
        console.log('OpenZeppelin contract instance created');
        
        console.log('Calling getMinDelay() function...');
        const minDelay = await ozContract.getMinDelay();
        console.log('OpenZeppelin timelock detected:', { minDelay: minDelay.toString() });
        return 'openzeppelin';
      } catch (error) {
        console.log('OpenZeppelin detection failed:', error);
        console.error('OpenZeppelin error details:', error);
      }
      
      console.log('No timelock standard detected');
      return null;
    } catch (error) {
      console.error('Error detecting timelock standard:', error);
      return null;
    }
  };

  /**
   * Get Compound timelock parameters
   */
  const getCompoundParameters = async (contractAddress: string): Promise<Partial<TimelockParameters>> => {
    if (!sdk) throw new Error('SDK not available');
    
    const provider = sdk.getProvider();
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
   * Get OpenZeppelin timelock parameters
   */
  const getOpenZeppelinParameters = async (contractAddress: string): Promise<Partial<TimelockParameters>> => {
    if (!sdk) throw new Error('SDK not available');
    
    const provider = sdk.getProvider();
    const contract = new ethers.Contract(contractAddress, OPENZEPPELIN_TIMELOCK_ABI, provider);
    
    try {
      const [minDelay, proposers, executors, cancellers] = await Promise.all([
        contract.getMinDelay(),
        getRoleMembers(contract, PROPOSER_ROLE),
        getRoleMembers(contract, EXECUTOR_ROLE),
        getRoleMembers(contract, CANCELLER_ROLE),
      ]);
      
      return {
        minDelay: minDelay.toNumber(),
        proposers,
        executors,
        cancellers,
      };
    } catch (error) {
      console.error('Error getting OpenZeppelin parameters:', error);
      throw error;
    }
  };

  /**
   * Fetch timelock parameters from blockchain
   */
  const fetchTimelockParameters = useCallback(async (contractAddress: string): Promise<TimelockParameters> => {
    if (!sdk) {
      throw new Error('Please connect your wallet first');
    }

    if (!ethers.utils.isAddress(contractAddress)) {
      throw new Error('Invalid contract address');
    }

    setIsLoading(true);

    try {
      // Detect standard
      const standard = await detectTimelockStandard(contractAddress);
      
      if (!standard) {
        throw new Error('Contract is not a valid Compound or OpenZeppelin timelock');
      }

      let params: Partial<TimelockParameters>;
      
      if (standard === 'compound') {
        params = await getCompoundParameters(contractAddress);
      } else {
        params = await getOpenZeppelinParameters(contractAddress);
      }

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
  }, [sdk]);

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
    if (!sdk) return false;
    
    try {
      console.log(address, 'validateContractAddress');
      console.log(ethers.utils.isAddress(address), 'ethers.utils.isAddress(address)');
      
      if (!ethers.utils.isAddress(address)) return false;
      
      const provider = sdk.getProvider();
      const code = await provider.getCode(address);
      console.log(code, 'code');
      
      // Check if it's a contract (has code)
      return code !== '0x';
    } catch (error) {
      console.error('Error validating contract address:', error);
      return false;
    }
  }, [sdk]);

  return {
    isLoading,
    parameters,
    fetchTimelockParameters,
    clearParameters,
    validateContractAddress,
  };
};