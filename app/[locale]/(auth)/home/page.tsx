'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Assert from './components/Assert';
import CreateProtocol from './components/CreateProtocol';
import { useConnectionStatus } from '@thirdweb-dev/react';
import { useAuthStore } from '@/store/userStore';
import { useApi } from '@/hooks/useApi'; // Import useApi


export default function Home() {
  const connectionStatus = useConnectionStatus();
  const isConnected = connectionStatus === "connected";
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: assetsResponse, request: fetchAssets, isLoading, error } = useApi();
  const [hasAssets, setHasAssets] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isConnected) {
      setHasAssets(false); // If not connected, assume no assets to display
      return;
    }
    // if (!accessToken) {
    //   console.warn('No access token found. Redirecting to login.');
    //   router.push(`/${locale}/login`);
    //   return;
    // }

    // Fetch assets using useApi
    fetchAssets('/api/v1/assets', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }, [isConnected, accessToken, router, fetchAssets]);

  useEffect(() => {
    if (assetsResponse) {
      if (assetsResponse.success && assetsResponse.data && assetsResponse.data.assets && assetsResponse.data.assets.length > 0) {
        setHasAssets(true);
      } else {
        setHasAssets(false);
      }
    }
  }, [assetsResponse]);

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch assets:', error);
      // Decide what to do on error: show CreateProtocol, redirect, or show error message
      setHasAssets(false); // Assume no assets on error
    }
  }, [error]);

  if (!isConnected) {
    return <CreateProtocol />;
  }

  if (isLoading || hasAssets === null) {
    return <div>Loading assets...</div>;
  }

  if (hasAssets) {
    return <Assert assetsResponse={assetsResponse} isLoading={isLoading} error={error} />;
  } else {
    return <CreateProtocol />;
  }
}
