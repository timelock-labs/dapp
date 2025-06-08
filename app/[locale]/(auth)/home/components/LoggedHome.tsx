import React from 'react';
import { useTranslations } from 'next-intl'; // 导入 useTranslations
import PageLayout from '@/components/layout/PageLayout'; // 导入 PageLayout
import TotalAssetValue from './TotalAssetValue';
import AssetList from './AssetList';
import PendingTransactions from './PendingTransactions';

const LoggedHome: React.FC = () => {
  const t = useTranslations('HomePage'); // 或者您想使用的其他命名空间

  return (
    <PageLayout title={t('title')}> {/* 使用 PageLayout 包裹 */}
      <div className="flex flex-col space-y-6"> {/* 移除 min-h-screen, bg-gray-100, p-8，这些应由 PageLayout 或其子级处理 */}

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

export default LoggedHome;