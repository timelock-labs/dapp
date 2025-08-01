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
    <div className={`connect-wallet-wrapper ${props.fullWidth ? "w-full" : "header-btn"}`}>
      <ConnectButton
        client={client}
        connectModal={{ 
          size: "compact",
          ...(props.headerStyle && { title: "连接钱包" })
        }}
        wallets={wallets}
        theme="dark"
        onConnect={() => {
          console.log("Wallet connected");
        }}
        onDisconnect={() => {
          console.log("Wallet disconnected");
          logout();
          router.push('/login');
        }}
      />
      <style jsx global>{`
        /* 连接前的按钮样式 */
        .connect-wallet-wrapper [data-testid="connect-button"],
        .connect-wallet-wrapper button[data-theme] {
          background-color: #000000 !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 0.375rem !important;
          font-weight: 500 !important;
          transition: background-color 0.2s ease !important;
          cursor: pointer !important;
          height: 48px !important;
        }
        
        .connect-wallet-wrapper [data-testid="connect-button"]:hover,
        .connect-wallet-wrapper button[data-theme]:hover {
          background-color: #374151 !important;
        }

        .connect-wallet-wrapper>.tw-connect-wallet,
        .connect-wallet-wrapper>.tw-connected-wallet {
          width: 100% !important;
        }
        .connect-wallet-wrapper>.tw-connected-wallet > div:first-child {
          display: none !important;
        }
        .connect-wallet-wrapper>.tw-connected-wallet > div:last-child > span:last-child {
          display: none !important;
        }

        .connect-wallet-wrapper>.tw-connected-wallet > div:last-child > span:first-child > span {
          text-align: center !important;
        }
          
        .header-btn >.tw-connected-wallet {
          height: 36px !important;
          width: 115px !important;
        }
      `}</style>
    </div>
  )
}) 

