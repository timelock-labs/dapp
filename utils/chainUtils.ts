import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';

// Chain info interface based on API response
export interface ChainInfo {
  chain_id: number;
  chain_name: string;
  created_at: string;
  display_name: string;
  id: number;
  is_active: boolean;
  is_testnet: boolean;
  logo_url: string;
  native_token: string;
  updated_at: string;
}

export interface ChainApiResponse {
  data: ChainInfo;
  error?: {
    code: string;
    details: string;
    message: string;
  };
  success: boolean;
}

/**
 * Hook for chain-related operations
 */
export const useChainUtils = () => {
  const { request } = useApi();
  const { accessToken } = useAuthStore();

  const createHeaders = () => ({
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  });

  /**
   * Get chain information by chain ID
   * @param chainId - The chain ID to query
   * @returns Promise<ChainInfo | null>
   */
  const getChainByChainId = async (chainId: number): Promise<ChainInfo | null> => {
    try {
      const response = await request(`/api/v1/chain/chainid/${chainId}`, {
        method: 'GET',
        headers: createHeaders(),
      });

      if (response?.success && response.data) {
        return response.data as ChainInfo;
      } else {
        console.error('Failed to fetch chain info:', response?.error?.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching chain info:', error);
      return null;
    }
  };

  return {
    getChainByChainId,
  };
};

/**
 * Utility functions for chain operations (non-hook functions)
 */
export class ChainUtils {
  /**
   * Get chain information from local chains array by chain ID
   * @param chains - Array of chains from store
   * @param chainId - The chain ID to find
   * @returns ChainInfo | undefined
   */
  static getChainFromLocal(chains: any[], chainId: number | string): any | undefined {
    const id = typeof chainId === 'string' ? parseInt(chainId) : chainId;
    return chains.find(chain => chain.chain_id === id);
  }

  /**
   * Get chain name by chain ID from local chains
   * @param chains - Array of chains from store
   * @param chainId - The chain ID
   * @returns string
   */
  static getChainName(chains: any[], chainId: number | string): string {
    const chain = ChainUtils.getChainFromLocal(chains, chainId);
    return chain?.chain_name || chain?.display_name || 'Unknown Chain';
  }

  /**
   * Get chain logo URL by chain ID from local chains
   * @param chains - Array of chains from store
   * @param chainId - The chain ID
   * @returns string
   */
  static getChainLogo(chains: any[], chainId: number | string): string {
    const chain = ChainUtils.getChainFromLocal(chains, chainId);
    return chain?.logo_url || '';
  }

  /**
   * Get native token symbol by chain ID from local chains
   * @param chains - Array of chains from store
   * @param chainId - The chain ID
   * @returns string
   */
  static getNativeToken(chains: any[], chainId: number | string): string {
    const chain = ChainUtils.getChainFromLocal(chains, chainId);
    return chain?.native_token || 'ETH';
  }

  /**
   * Check if chain is testnet by chain ID from local chains
   * @param chains - Array of chains from store
   * @param chainId - The chain ID
   * @returns boolean
   */
  static isTestnet(chains: any[], chainId: number | string): boolean {
    const chain = ChainUtils.getChainFromLocal(chains, chainId);
    return chain?.is_testnet || false;
  }

  /**
   * Format chain display name with testnet indicator
   * @param chains - Array of chains from store
   * @param chainId - The chain ID
   * @returns string
   */
  static getDisplayName(chains: any[], chainId: number | string): string {
    const chain = ChainUtils.getChainFromLocal(chains, chainId);
    if (!chain) return 'Unknown Chain';
    
    const name = chain.display_name || chain.chain_name;
    return chain.is_testnet ? `${name} (Testnet)` : name;
  }
}