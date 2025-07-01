'use client'

import { ConnectKitButton } from 'connectkit'
import { useAccount, useSignMessage } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
import { memo, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

export const ConnectWallet = memo(function ConnectWallet( props: { icon?: boolean, fullWidth?: boolean, headerStyle?: boolean }) {
  const { isConnected, isDisconnected } = useAccount()
  const { signMessage } = useSignMessage()
  const prevIsConnected = useRef(isConnected)
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    if (!prevIsConnected.current && isConnected) {
      signMessage({ message: 'welcome to TimeLocker!' })
    }
    prevIsConnected.current = isConnected
  }, [isConnected, signMessage])

  useEffect(() => {
    if (isDisconnected) {
      logout();
      // router.push('/login');
    }
  }, [isDisconnected, logout, router]);

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, address, ensName }) => {
        return (
          <Button
            onClick={show}
            disabled={isConnecting}
            variant={props.headerStyle ? "default" : (isConnected ? "outline" : "default")}
            size={props.icon ? "sm" : "lg"}
            className={props.fullWidth ? "w-full" : (props.headerStyle ? "bg-black text-white" : "")}
          >
            {
              props.icon && !props.headerStyle ? <Wallet className="mr-2 h-4 w-4" /> : null
            }
            {isConnecting && "Connecting..."}
            {isConnected && (ensName ?? `${address?.slice(0, 6)}...${address?.slice(-4)}`)}
            {!isConnected && !isConnecting && "Connect Wallet"}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}) 