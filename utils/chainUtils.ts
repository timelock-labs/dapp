import {
  ethereum,
  sepolia,
  polygon,
  bsc,
  bscTestnet,
  optimism,
  avalanche,
  base,
  arbitrum,
  gnosis,
  linea,
  zkSync,
  scroll,
  celo,
  defineChain,
} from 'thirdweb/chains';
import type { Chain, ChainIdMapping } from '@/types';

// Define custom chains not available in thirdweb/chains
const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpc: 'https://testnet-rpc.monad.xyz',
});

const ronin = defineChain({
  id: 2020,
  name: 'Ronin',
  nativeCurrency: { name: 'RON', symbol: 'RON', decimals: 18 },
  rpc: 'https://ronin.drpc.org',
});

const mantle = defineChain({
  id: 5000,
  name: 'Mantle',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  rpc: 'https://rpc.mantle.xyz',
});

const unichain = defineChain({
  id: 130,
  name: 'Unichain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpc: 'https://rpc.unichain.org',
});

const ink = defineChain({
  id: 57073,
  name: 'Ink',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpc: 'https://rpc-gel.inkonchain.com',
});

const berachain = defineChain({
  id: 80094,
  name: 'Berachain',
  nativeCurrency: { name: 'BERA', symbol: 'BERA', decimals: 18 },
  rpc: 'https://rpc.berachain.com',
});

const worldChain = defineChain({
  id: 480,
  name: 'World Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpc: 'https://worldchain-mainnet.g.alchemy.com/public',
});

// Map chain IDs to thirdweb chain objects
export const CHAIN_ID_TO_CHAIN: ChainIdMapping = {
  1: ethereum,
  10: optimism,
  56: bsc,
  97: bscTestnet,
  100: gnosis,
  130: unichain,
  137: polygon,
  324: zkSync,
  480: worldChain,
  534352: scroll,
  2020: ronin,
  5000: mantle,
  8453: base,
  10143: monadTestnet,
  11155111: sepolia,
  42161: arbitrum,
  42220: celo,
  43114: avalanche,
  57073: ink,
  59144: linea,
  80094: berachain,
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
