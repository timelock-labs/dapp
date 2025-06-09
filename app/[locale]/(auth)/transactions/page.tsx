import React from 'react';
import PendingTransactionsSection from './components/PendingTransactionsSection';
import TransactionHistorySection from './components/TransactionHistorySection';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';

const Transactions: React.FC = () => {
    const  t  = useTranslations('Transactions');
  return (
    <PageLayout title={t('title')}>
 <div className="min-h-screen bg-white p-4 flex flex-col space-y-8"> {/* Overall page styling */}
      {/* Pending Transactions Section */}
      <PendingTransactionsSection />

      {/* Transaction History Section */}
      <TransactionHistorySection />
    </div>
    </PageLayout>
   
  );
};

export default Transactions;