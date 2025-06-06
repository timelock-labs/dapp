'use client'

import { ConnectKitButton } from 'connectkit'
// import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'

export function ConnectWallet( props: { icon?: boolean }) {
  // const { isConnected } = useAccount()

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, address, ensName }) => {
        return (
          <Button
            onClick={show}
            disabled={isConnecting}
            variant={isConnected ? "outline" : "default"}
            size={props.icon ? "sm" : "lg"}
          >
            {
              props.icon ? <Wallet className="mr-2 h-4 w-4" /> : null
            }
            {isConnecting && "Connecting..."}
            {isConnected && (ensName ?? `${address?.slice(0, 6)}...${address?.slice(-4)}`)}
            {!isConnected && !isConnecting && "Connect Wallet"}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
} 