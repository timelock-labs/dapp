import React from 'react';
import TransactionHistorySection from './components/TransactionHistorySection';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';

const Transactions: React.FC = () => {
	const t = useTranslations('Transactions');
	return (
		<PageLayout title={t('title')}>
				<TransactionHistorySection />
		</PageLayout>
	);
};

export default Transactions;
