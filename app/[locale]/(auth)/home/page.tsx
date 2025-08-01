'use client';

import React from 'react';
import Assert from './components/Assert';
import CreateProtocol from './components/CreateProtocol';
import { useActiveWalletConnectionStatus } from 'thirdweb/react';
import { useAssetsApi } from '@/hooks/useAssetsApi';
import type { Asset } from './components/Assert';

export default function Home() {
  const connectionStatus = useActiveWalletConnectionStatus();
  const isConnected = connectionStatus === "connected";

  const { data: assetsData, isLoading, error, hasAssets } = useAssetsApi();

  if (!isConnected) {
    return <CreateProtocol />;
  }

  if (isLoading || hasAssets === null) {
    return <div>Loading assets...</div>;
  }

  if (hasAssets) {
    return <Assert assetsResponse={{ data: { assets: assetsData?.assets as Asset[] || [], total_usd_value: 0 }, success: true }} isLoading={isLoading} error={error} />;
  } else {
    return <CreateProtocol />;
  }
}
