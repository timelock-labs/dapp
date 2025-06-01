'use client'

import { ConnectKitButton } from 'connectkit'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

const chainNames = {
  1: 'Ethereum',
  56: 'BSC',
  42161: 'Arbitrum',
  137: 'Polygon',
  177234: 'HashKey Chain', // 根据实际的 chain ID 调整
}

export function ConnectWallet() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  return (
    <div className="flex items-center gap-2">
      {isConnected && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {chainNames[chainId as keyof typeof chainNames] || `Chain ${chainId}`}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // 这里可以添加链切换的逻辑
              console.log('Switch chain clicked')
            }}
          >
            Switch <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}
      
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
          return (
            <Button
              onClick={show}
              disabled={isConnecting}
              variant={isConnected ? "outline" : "default"}
            >
              {isConnecting && "Connecting..."}
              {isConnected && (ensName ?? `${address?.slice(0, 6)}...${address?.slice(-4)}`)}
              {!isConnected && !isConnecting && "Connect Wallet"}
            </Button>
          )
        }}
      </ConnectKitButton.Custom>
    </div>
  )
} 