'use client'

import { useSwitchChain, useChainId, useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Network } from 'lucide-react'

const supportedChains = [
  { id: 1, name: 'Ethereum', icon: '⟠', color: 'text-blue-500' },
  { id: 56, name: 'BSC', icon: '🟨', color: 'text-yellow-500' },
  { id: 42161, name: 'Arbitrum', icon: '🔵', color: 'text-blue-600' },
  { id: 177, name: 'HashKey Chain', icon: '🔑', color: 'text-purple-500' },
]

export function ChainSwitcher() {
  const { switchChain } = useSwitchChain()
  const chainId = useChainId()
  const { isConnected } = useAccount()
  
  const currentChain = supportedChains.find(chain => chain.id === chainId)

  if (!isConnected) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Network className="mr-2 h-4 w-4" />
        No Network
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <span className="mr-2">{currentChain?.icon || '🔗'}</span>
          <span className="hidden sm:inline">
            {currentChain?.name || 'Unknown Chain'}
          </span>
          <ChevronDown className="ml-2 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportedChains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            className={`${chainId === chain.id ? 'bg-accent' : ''} cursor-pointer`}
          >
            <span className="mr-3 text-lg">{chain.icon}</span>
            <div className="flex flex-col">
              <span className="font-medium">{chain.name}</span>
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