'use client';

import React from 'react';
import Assert from './components/Assert';
import CreateProtocol from './components/CreateProtocol';
import { useConnectionStatus } from '@thirdweb-dev/react';
import { useAssetsApi } from '@/hooks/useAssetsApi';

export default function Home() {
  const connectionStatus = useConnectionStatus();
  const isConnected = connectionStatus === "connected";

  const { data: assetsData, isLoading, error, hasAssets } = useAssetsApi();

  if (!isConnected) {
    return <CreateProtocol />;
  }

  if (isLoading || hasAssets === null) {
    return <div>Loading assets...</div>;
  }

  if (hasAssets) {
    return <Assert assetsResponse={{ data: assetsData, success: true }} isLoading={isLoading} error={error} />;
  } else {
    return <CreateProtocol />;
  }
}
