"use client";

import React, { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TotalAssetValue from './TotalAssetValue';
import AssetList from './AssetList';
import PendingTransactions from './PendingTransactions';
import { useApi } from '@/hooks/useApi';

const Assert: React.FC = () => {
  const { data: assetsResponse, request: fetchAssets, isLoading, error } = useApi();

  useEffect(() => {
    fetchAssets('/api/v1/assets', {
      method: 'GET',
    });
  }, [fetchAssets]);

  if (isLoading) {
    return <PageLayout title="Home">Loading assets...</PageLayout>;
  }

  if (error) {
    return <PageLayout title="Home">Error loading assets: {error.message}</PageLayout>;
  }

  const assets = assetsResponse?.data?.assets || [];
  const totalUsdValue = assetsResponse?.data?.total_usd_value || 0;

  return (
    <PageLayout title="Home"> {/* 使用 PageLayout 包裹 */}
      <div className="flex flex-col space-y-6"> 

        {/* Top Section: Total Asset Value */}
        <div className="w-full">
          <TotalAssetValue totalUsdValue={totalUsdValue} />
        </div>

        {/* Bottom Section: Asset List and Pending Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
          {/* Asset List */}
          <div className="md:col-span-1 flex flex-col">
            <AssetList assets={assets} />
          </div>

          {/* Pending Transactions */}
          <div className="md:col-span-2 flex flex-col">
            <PendingTransactions />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Assert;