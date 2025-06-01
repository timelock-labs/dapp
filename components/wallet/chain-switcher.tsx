'use client'

import { useSwitchChain, useChainId } from 'wagmi'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

const supportedChains = [
  { id: 1, name: 'Ethereum', icon: '⟠' },
  { id: 56, name: 'BSC', icon: '🟨' },
  { id: 42161, name: 'Arbitrum', icon: '🔵' },
  { id: 177, name: 'HashKey Chain', icon: '🔑' }, // 根据实际调整
]

export function ChainSwitcher() {
  const { switchChain } = useSwitchChain()
  const chainId = useChainId()
  
  const currentChain = supportedChains.find(chain => chain.id === chainId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <span className="mr-2">{currentChain?.icon}</span>
          {currentChain?.name || 'Unknown Chain'}
          <ChevronDown className="ml-2 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedChains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            className={chainId === chain.id ? 'bg-accent' : ''}
          >
            <span className="mr-2">{chain.icon}</span>
            {chain.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 