/**
 * Chain Utils Usage Examples
 * 
 * This file demonstrates how to use the chain utility functions
 */

import React, { useEffect, useState } from 'react';
import { useChainUtils, ChainUtils, ChainInfo } from '@/utils/chainUtils';
import { useAuthStore } from '@/store/userStore';
import Image from 'next/image';

// Example 1: Using the hook to fetch chain info from API
export const ChainInfoDisplay: React.FC<{ chainId: number }> = ({ chainId }) => {
  const { getChainByChainId } = useChainUtils();
  const [chainInfo, setChainInfo] = useState<ChainInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChainInfo = async () => {
      setLoading(true);
      const info = await getChainByChainId(chainId);
      setChainInfo(info);
      setLoading(false);
    };

    fetchChainInfo();
  }, [chainId, getChainByChainId]);

  if (loading) return <div>Loading chain info...</div>;
  if (!chainInfo) return <div>Chain not found</div>;

  return (
    <div className="flex items-center space-x-2">
      {chainInfo.logo_url && (
        <Image 
          src={chainInfo.logo_url} 
          alt={chainInfo.chain_name}
          width={24}
          height={24}
          className="rounded-full"
        />
      )}
      <span>{chainInfo.display_name}</span>
      {chainInfo.is_testnet && (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          Testnet
        </span>
      )}
    </div>
  );
};

// Example 2: Using static methods with local chains data
export const ChainDisplayFromLocal: React.FC<{ chainId: number }> = ({ chainId }) => {
  const { chains } = useAuthStore();

  const chainName = ChainUtils.getChainName(chains, chainId);
  const chainLogo = ChainUtils.getChainLogo(chains, chainId);
  const nativeToken = ChainUtils.getNativeToken(chains, chainId);
  const isTestnet = ChainUtils.isTestnet(chains, chainId);
  const displayName = ChainUtils.getDisplayName(chains, chainId);

  return (
    <div className="flex items-center space-x-2">
      {chainLogo && (
        <Image 
          src={chainLogo} 
          alt={chainName}
          width={20}
          height={20}
          className="rounded-full"
        />
      )}
      <span>{displayName}</span>
      <span className="text-xs text-gray-500">({nativeToken})</span>
    </div>
  );
};

// Example 3: Simple chain selector with chain info
export const ChainSelector: React.FC = () => {
  const { chains } = useAuthStore();
  const [selectedChain, setSelectedChain] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <select 
        value={selectedChain || ''} 
        onChange={(e) => setSelectedChain(Number(e.target.value))}
        className="w-full p-2 border rounded"
      >
        <option value="">Select a chain</option>
        {chains.map(chain => (
          <option key={chain.chain_id} value={chain.chain_id}>
            {ChainUtils.getDisplayName(chains, chain.chain_id)} 
            ({ChainUtils.getNativeToken(chains, chain.chain_id)})
          </option>
        ))}
      </select>
      
      {selectedChain && (
        <ChainDisplayFromLocal chainId={selectedChain} />
      )}
    </div>
  );
};

// Example 4: Chain info in a table
export const ChainInfoTable: React.FC<{ chainIds: number[] }> = ({ chainIds }) => {
  const { chains } = useAuthStore();

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-50">
          <th className="border p-2">Chain</th>
          <th className="border p-2">Native Token</th>
          <th className="border p-2">Type</th>
        </tr>
      </thead>
      <tbody>
        {chainIds.map(chainId => {
          const chain = ChainUtils.getChainFromLocal(chains, chainId);
          if (!chain) return null;
          
          return (
            <tr key={chainId}>
              <td className="border p-2">
                <div className="flex items-center space-x-2">
                  {chain.logo_url && (
                    <Image 
                      src={chain.logo_url} 
                      alt={chain.chain_name}
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                  )}
                  <span>{chain.display_name || chain.chain_name}</span>
                </div>
              </td>
              <td className="border p-2">{chain.native_token}</td>
              <td className="border p-2">
                {chain.is_testnet ? 'Testnet' : 'Mainnet'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};