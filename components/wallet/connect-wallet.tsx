'use client'

import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { memo } from 'react'
import { useAuthStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "....",
});

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.okex.wallet"),
  createWallet("global.safe"),
  createWallet("com.safepal"),
];

export const ConnectWallet = memo(function ConnectWallet( props: { icon?: boolean, fullWidth?: boolean, headerStyle?: boolean }) {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return (
    <ConnectButton
      client={client}
      connectModal={{ size: "compact" }}
      wallets={wallets}
      onConnect={() => {
        console.log("Wallet connected");
      }}
      onDisconnect={() => {
        console.log("Wallet disconnected");
        logout();
        router.push('/login');
      }}
    />
  )
}) 

