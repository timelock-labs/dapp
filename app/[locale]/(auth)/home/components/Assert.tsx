import React from 'react';
import PageLayout from '@/components/layout/PageLayout'; // 导入 PageLayout
import TotalAssetValue from './TotalAssetValue';
import AssetList from './AssetList';
import PendingTransactions from './PendingTransactions';

const Assert: React.FC = () => {
  return (
    <PageLayout title="Home"> {/* 使用 PageLayout 包裹 */}
      <div className="flex flex-col space-y-6"> 

        {/* Top Section: Total Asset Value */}
        <div className="w-full">
          <TotalAssetValue />
        </div>

        {/* Bottom Section: Asset List and Pending Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
          {/* Asset List */}
          <div className="md:col-span-1 flex flex-col">
            <AssetList />
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