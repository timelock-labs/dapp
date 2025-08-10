import React from 'react';
import TransactionHistorySection from './components/TransactionHistorySection';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';

const Transactions: React.FC = () => {
	const t = useTranslations('Transactions');
	return (
		<PageLayout title={t('title')}>
			<div className='bg-white flex flex-col space-y-8 h-full overflow-y-auto p-6'>
				<TransactionHistorySection />
			</div>
		</PageLayout>
	);
};

export default Transactions;
