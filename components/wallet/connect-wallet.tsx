'use client'

import { useConnectionStatus, useSigner, ConnectWallet as ThirdwebConnectWallet } from '@thirdweb-dev/react'
import { memo, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

export const ConnectWallet = memo(function ConnectWallet( props: { icon?: boolean, fullWidth?: boolean, headerStyle?: boolean }) {
  // const connect = useConnect()
  const connectionStatus = useConnectionStatus()
  const signer = useSigner()
  const prevConnectionStatus = useRef(connectionStatus)
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const isConnected = connectionStatus === "connected"
  const isDisconnected = connectionStatus === "disconnected"

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
  }, [connectionStatus, signer])

  useEffect(() => {
    if (isDisconnected) {
      logout();
      // router.push('/login');
    }
  }, [isDisconnected, logout, router]);

  return (
    // <Button
    //     onClick={handleConnect}
    //     disabled={isConnecting}
    //     variant={props.headerStyle ? "default" : (isConnected ? "outline" : "default")}
    //     size={props.icon ? "sm" : "lg"}
    //     className={props.fullWidth ? "w-full" : (props.headerStyle ? "bg-black text-white" : "")}
    //   >
    //     {
    //       props.icon && !props.headerStyle ? <Wallet className="mr-2 h-4 w-4" /> : null
    //     }
    //     {isConnecting && "Connecting..."}
    //     {isConnected && `${address?.slice(0, 6)}...${address?.slice(-4)}`}
    //     {!isConnected && !isConnecting && "Connect Wallet"}
    //   </Button>
    <ThirdwebConnectWallet
      theme="dark"
      // The component handles its own states (connecting, connected, address display, etc.)
      // We can apply custom classes for styling.
      className={`${props.fullWidth ? "w-full" : ""} ${props.headerStyle ? "!bg-black !text-white" : ""}`}
      // Note: The thirdweb component has its own styling. Overriding it completely
      // with custom classes might require '!important' or more specific selectors.
    />
  )
}) 