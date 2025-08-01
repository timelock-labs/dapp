import { 
  ethereum, sepolia, 
  polygon, bsc, bscTestnet,
  optimism, avalanche,
  base, arbitrum } from "thirdweb/chains";
import type { Chain, ChainApiResponse, ChainIdMapping } from '@/types';

// Map chain IDs to thirdweb chain objects
export const CHAIN_ID_TO_CHAIN: ChainIdMapping = {
  1: ethereum,
  11155111: sepolia,
  137: polygon,
  43114: avalanche,
  56: bsc,
  97: bscTestnet,
  42161: arbitrum,
  10: optimism,
  8453: base,
} as const;

/**
 * Get the thirdweb chain object for a given chain ID
 * @param chainId - The chain ID to look up
 * @returns The thirdweb chain object or undefined if not supported
 */
export function getChainObject(chainId: number) {
  return CHAIN_ID_TO_CHAIN[chainId as keyof typeof CHAIN_ID_TO_CHAIN];
}

/**
 * Utility functions for chain operations (non-hook functions)
 */
export class ChainUtils {
  /**
   * Get chain information from local chains array by chain ID
   * @param chains - Array of chains from store
   * @param chainId - The chain ID to find
   * @returns Chain | undefined
   */
  static getChainFromLocal(chains: Chain[], chainId: number | string): Chain | undefined {
    const id = typeof chainId === 'string' ? parseInt(chainId) : chainId;
    return chains.find(chain => chain.chain_id === id);
  }

  /**
   * Get chain name by chain ID from local chains
   * @param chains - Array of chains from store
   * @param chainId - The chain ID
   * @returns string
   */
  static getChainName(chains: Chain[], chainId: number | string): string {
    const chain = ChainUtils.getChainFromLocal(chains, chainId);
    return chain?.chain_name || chain?.display_name || 'Unsupport Chain';
  }

  /**
   * Get chain logo URL by chain ID from local chains
   * @param chains - Array of chains from store
   * @param chainId - The chain ID
   * @returns string
   */
  static getChainLogo(chains: Chain[], chainId: number | string): string {
    const chain = ChainUtils.getChainFromLocal(chains, chainId);
    return chain?.logo_url || '';
  }

  /**
   * Get native token symbol by chain ID from local chains
   * @param chains - Array of chains from store
   * @param chainId - The chain ID
   * @returns string
   */
  static getNativeToken(chains: Chain[], chainId: number | string): string {
    const chain = ChainUtils.getChainFromLocal(chains, chainId);
    return chain?.native_token || 'ETH';
  }

  /**
   * Check if chain is testnet by chain ID from local chains
   * @param chains - Array of chains from store
   * @param chainId - The chain ID
   * @returns boolean
   */
  static isTestnet(chains: Chain[], chainId: number | string): boolean {
    const chain = ChainUtils.getChainFromLocal(chains, chainId);
    return chain?.is_testnet || false;
  }

  /**
   * Format chain display name with testnet indicator
   * @param chains - Array of chains from store
   * @param chainId - The chain ID
   * @returns string
   */
  static getDisplayName(chains: Chain[], chainId: number | string): string {
    const chain = ChainUtils.getChainFromLocal(chains, chainId);
    if (!chain) return 'Unsupport Chain';
    
    const name = chain.display_name || chain.chain_name;
    return chain.is_testnet ? `${name} (Testnet)` : name;
  }
}