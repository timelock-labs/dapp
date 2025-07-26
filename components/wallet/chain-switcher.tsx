'use client'
import Image from 'next/image';
import { useSwitchChain, useChainId, useConnectionStatus, useSigner } from '@thirdweb-dev/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Network } from 'lucide-react'
import { useAuthStore } from '@/store/userStore';
import { useEffect, useRef } from 'react'
import { useApi } from '@/hooks/useApi';

export function ChainSwitcher() {
  const switchChain = useSwitchChain()
  const chainId = useChainId()
  const connectionStatus = useConnectionStatus()
  const isConnected = connectionStatus === "connected"
  const signer = useSigner()
  const { chains, fetchChains, _hasHydrated, login } = useAuthStore()
  const { data: switchChainResponse, request: switchChainRequest, isLoading: isSwitchingChain, error: switchChainError } = useApi();
  const hasFetchedChains = useRef(false);

  // 使用单独的 useEffect 来重置 fetch 状态当 chains 变为非空时
  useEffect(() => {
    if (chains && chains.length > 0) {
      hasFetchedChains.current = false; // 允许下次重新获取
    }
  }, [chains]);

  useEffect(() => {
    console.log('ChainSwitcher: _hasHydrated =', _hasHydrated);
    console.log('ChainSwitcher: chains length =', chains?.length);
    console.log('ChainSwitcher: hasFetchedChains =', hasFetchedChains.current);

    if (_hasHydrated && !hasFetchedChains.current && (!chains || chains.length === 0)) {
      console.log('ChainSwitcher: Calling fetchChains');
      hasFetchedChains.current = true;
      fetchChains()
    }
  }, [fetchChains, _hasHydrated])

  useEffect(() => {
    if (switchChainError) {
      console.error('Error switching chain via API:', switchChainError);
      // Optionally show a toast or alert to the user
    }
  }, [switchChainError]);

  useEffect(() => {
    if (switchChainResponse && switchChainResponse.success) {
      login({
        user: switchChainResponse.data.user,
        accessToken: switchChainResponse.data.access_token,
        refreshToken: switchChainResponse.data.refresh_token,
        expiresAt: switchChainResponse.data.expires_at,
      });
      console.log('Chain switched and auth tokens updated successfully!');
    } else if (switchChainResponse && switchChainResponse.error) {
      console.error('Backend chain switch failed:', switchChainResponse.error.message);
    }
  }, [switchChainResponse, login]);

  if (!_hasHydrated) {
    return <div>Loading chains...</div>; // Or a loading spinner
  }

  const currentChain = Array.isArray(chains) ? chains.find(chain => chain.id === chainId) : undefined

  if (!isConnected) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Network className="mr-2 h-4 w-4" />
        No Network
      </Button>
    )
  }

  const handleChainSwitch = async (newChainId: number) => {
    try {
      // 1. Switch chain in wallet
      try {
        await switchChain(newChainId);
      } catch (error: any) {
        // If the chain is not configured, try to add it
        if (error?.name?.includes('ChainNotConfigured')) {
          const chainToAdd = Array.isArray(chains) ? chains.find(c => c.chain_id === newChainId) : undefined;
                      
          if (chainToAdd && typeof window !== 'undefined' && (window as any).ethereum) {
            try {
              await (window as any).ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: "0x89", // 16进制形式的 chainId（Polygon 主网为 137）
                    chainName: "Polygon Mainnet",
                    nativeCurrency: {
                      name: "MATIC",
                      symbol: "MATIC",
                      decimals: 18,
                    },
                    rpcUrls: ["https://polygon-rpc.com/"],
                    blockExplorerUrls: ["https://polygonscan.com/"],
                  },
                ],
              });
              // Try switching again after adding
              await switchChain(newChainId);
            } catch (addError) {
              console.error('Failed to add chain to wallet:', addError);
              return;
            }
          } else {
            console.error('Chain info not found or ethereum provider missing');
            return;
          }
        } else {
          console.error('Failed to switch chain:', error);
          return;
        }
      }

      // 2. Sign a message
      const message = `Switching to chain ${newChainId}`;
      const signature = await signer?.signMessage(message);

      // 3. Call backend API using the request function from useApi
      switchChainRequest('/api/v1/auth/switch-chain', {
        method: 'POST',
        body: {
          chain_id: newChainId,
          message,
          signature,
        },
      });

    } catch (error) {
      console.error('Failed to switch chain or sign message:', error);
      // Handle user rejecting signature or other errors
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=' cursor-pointer'>
        <Button variant="outline" size="sm" disabled={isSwitchingChain}>
          <span className="mr-1">{currentChain?.logo_url && <Image src={currentChain.logo_url} alt={currentChain.chain_name || ''} width={16} height={16} />}</span>
          <span className="hidden sm:inline">
            {currentChain?.chain_name || 'Unsupport Chain'}
          </span>
          <ChevronDown className="ml-2 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Array.isArray(chains) && chains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => handleChainSwitch(chain.chain_id)}
            className={`${chainId === chain.id ? 'bg-accent' : ''} cursor-pointer`}
            disabled={isSwitchingChain}
          >
            <span className="mr-1 text-lg"><Image src={chain.logo_url} alt={chain.chain_name} width={20} height={20} /></span>
            <div className="flex flex-col">
              <span className="font-medium">{chain.chain_name}</span>
              {chainId === chain.id && (
                <span className="text-xs text-muted-foreground">Connected</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
