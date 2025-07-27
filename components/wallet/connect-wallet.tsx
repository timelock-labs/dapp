'use client'

import { useConnectionStatus, useAddress, useConnect, useDisconnect, metamaskWallet } from '@thirdweb-dev/react'
import { memo, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const ConnectWallet = memo(function ConnectWallet( props: { icon?: boolean, fullWidth?: boolean, headerStyle?: boolean }) {
  const connect = useConnect()
  const disconnect = useDisconnect()
  const address = useAddress()
  const connectionStatus = useConnectionStatus()
  const prevConnectionStatus = useRef(connectionStatus)
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const isConnected = connectionStatus === "connected"
  const isDisconnected = connectionStatus === "disconnected"
  const isConnecting = connectionStatus === "connecting"

  useEffect(() => {
    // 移除重复的签名逻辑，签名逻辑统一在登录页面处理
    prevConnectionStatus.current = connectionStatus
  }, [connectionStatus])

  useEffect(() => {
    if (isDisconnected) {
      logout();
      router.push('/login');
    }
  }, [isDisconnected, logout, router]);

  const handleConnect = async () => {
    if (isConnected) {
      disconnect();
    } else {
      try {
        await connect(metamaskWallet());
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  return (
    <Button
        onClick={handleConnect}
        disabled={isConnecting}
        variant="default"
        size={props.icon ? "sm" : "lg"}
        className={`bg-black cursor-pointer text-white hover:bg-gray-800 ${props.fullWidth ? "w-full" : ""}`}
      >
        {isConnecting && "Connecting..."}
        {isConnected && address && `${address.slice(0, 6)}...${address.slice(-4)}`}
        {!isConnected && !isConnecting && "Connect Wallet"}
      </Button>
  )
}) 