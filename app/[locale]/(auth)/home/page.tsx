'use client';

import React from 'react';
import Assert from './components/Assert';
import CreateProtocol from './components/CreateProtocol';
import { useActiveWalletConnectionStatus } from 'thirdweb/react';
import { useTimelockApi } from '@/hooks/useTimelockApi';

export default function Home() {
  const connectionStatus = useActiveWalletConnectionStatus();
  const isConnected = connectionStatus === "connected";

  const { useTimelockList } = useTimelockApi();
  const { data: timelockData, isLoading, error } = useTimelockList({ status: 'active' });
  
  console.log(timelockData, 'timelockData');
  const hasTimelocks = !!(timelockData && timelockData.total > 0);

  if (!isConnected) {
    return <CreateProtocol />;
  }


  if (hasTimelocks) {
    return <Assert />;
  } else {
    return <CreateProtocol />;
  }
}
