'use client'
import Image from 'next/image';

import { useSwitchChain, useChainId, useAccount, useSignMessage } from 'wagmi'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Network } from 'lucide-react'
import { useAuthStore } from '@/store/userStore';
import { useEffect } from 'react'
import { useApi } from '@/hooks/useApi';

export function ChainSwitcher() {
  const { switchChain } = useSwitchChain()
  const chainId = useChainId()
  const { isConnected } = useAccount()
  const { chains, fetchChains, _hasHydrated, login } = useAuthStore()
  const { data: switchChainResponse, request: switchChainRequest, isLoading: isSwitchingChain, error: switchChainError } = useApi();
  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    if (_hasHydrated) {
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
      await switchChain({ chainId: newChainId as 1 | 56 | 42161 | 177 });

      // 2. Sign a message
      const message = `Switching to chain ${newChainId}`;
      const signature = await signMessageAsync({ message });

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
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isSwitchingChain}>
          <span className="mr-2">{currentChain?.logo_url && <Image src={currentChain.logo_url} alt={currentChain.chain_name || ''} width={16} height={16} />}</span>
          <span className="hidden sm:inline">
            {currentChain?.chain_name || 'Unknown Chain'}
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
            <span className="mr-3 text-lg"><Image src={chain.logo_url} alt={chain.chain_name} width={20} height={20} /></span>
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
