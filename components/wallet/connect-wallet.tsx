'use client'

import { useConnectionStatus, useSigner, useAddress, useConnect, useDisconnect, metamaskWallet } from '@thirdweb-dev/react'
import { memo, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const ConnectWallet = memo(function ConnectWallet( props: { icon?: boolean, fullWidth?: boolean, headerStyle?: boolean }) {
  const connect = useConnect()
  const disconnect = useDisconnect()
  const address = useAddress()
  const connectionStatus = useConnectionStatus()
  const signer = useSigner()
  const prevConnectionStatus = useRef(connectionStatus)
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const isConnected = connectionStatus === "connected"
  const isDisconnected = connectionStatus === "disconnected"
  const isConnecting = connectionStatus === "connecting"

  useEffect(() => {
    if (prevConnectionStatus.current !== "connected" && isConnected) {
      const message = 'welcome to TimeLocker!';
      signer?.signMessage(message).then((signature) => {
        // You can now use the signature for authentication or other purposes
        console.log("Signed message:", signature);
      }).catch((error) => {
        console.error("Failed to sign message:", error);
      });
    }
    prevConnectionStatus.current = connectionStatus
  }, [connectionStatus, signer, isConnected])

  useEffect(() => {
    if (isDisconnected) {
      logout();
      // router.push('/login');
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
        variant={props.headerStyle ? "default" : (isConnected ? "outline" : "default")}
        size={props.icon ? "sm" : "lg"}
        className={props.fullWidth ? "w-full" : (props.headerStyle ? "bg-black text-white" : "")}
      >
        {isConnecting && "Connecting..."}
        {isConnected && address && `${address.slice(0, 6)}...${address.slice(-4)}`}
        {!isConnected && !isConnecting && "Connect Wallet"}
      </Button>
  )
}) 