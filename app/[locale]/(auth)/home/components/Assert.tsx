"use client";

import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TotalAssetValue from './TotalAssetValue';
import AssetList from './AssetList';
import PendingTransactions from './PendingTransactions';

interface Asset {
  balance: string;
  balance_wei: string;
  chain_display_name: string;
  chain_id: number;
  chain_logo_url: string;
  chain_name: string;
  contract_address: string;
  is_native: boolean;
  is_testnet: boolean;
  last_updated: string;
  price_change_24h: number;
  token_decimals: number;
  token_logo_url: string;
  token_name: string;
  token_price: number;
  token_symbol: string;
  usd_value: number;
}

interface AssetsResponse {
  success: boolean;
  data?: {
    assets: Asset[];
    total_usd_value: number;
  };
}

interface AssertProps {
  assetsResponse: AssetsResponse | null;
  isLoading: boolean;
  error: Error | null;
}

const Assert: React.FC<AssertProps> = ({ assetsResponse, isLoading, error }) => {

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