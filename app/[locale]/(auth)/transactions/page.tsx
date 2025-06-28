import React from 'react';
import PendingTransactionsSection from './components/PendingTransactionsSection';
import TransactionHistorySection from './components/TransactionHistorySection';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';

const Transactions: React.FC = () => {
    const  t  = useTranslations('Transactions');
  return (
    <PageLayout title={t('title')}>
      <div className="bg-white flex flex-col space-y-8 h-full overflow-y-auto">
      {/* Pending Transactions Section */}
      <PendingTransactionsSection />

      {/* Transaction History Section */}
      <TransactionHistorySection />
    </div>
    </PageLayout>
   
  );
};

export default Transactions;