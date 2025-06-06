'use client';

import React, { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains'; // 您可以根据需要添加更多链
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

// 1. 创建 Wagmi 配置
const config = createConfig(
  getDefaultConfig({
    // 您的应用名称
    appName: 'Timelock UI',
    // 您的 WalletConnect Project ID
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!, // 确保在 .env.local 中设置此变量
    // 支持的链
    chains: [mainnet, sepolia], // 根据您的项目需求调整
  })
);

// 2. 创建 QueryClient
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}