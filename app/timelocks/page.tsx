'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import PageLayout from '@/components/layout/PageLayout';
import AddTimelockContractSection from './components/AddTimelockContractSection';
import TimelockContractTable from './components/TimelockContractTable';
import TableSkeleton from '@/components/ui/TableSkeleton';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import type { TimelockContractItem } from '@/types';

const Timelocks: React.FC = () => {
	const t = useTranslations('TimelockTable');
	const { data: timelockListResponse, request: fetchTimelockList, isLoading } = useApi();
	const { allTimelocks, setAllTimelocks } = useAuthStore();

	const refetchTimelocks = React.useCallback(() => {
		fetchTimelockList('/api/v1/timelock/list', {
			method: 'GET',
		});
	}, [fetchTimelockList]);

	useEffect(() => {
		refetchTimelocks();
	}, [refetchTimelocks]);

	useEffect(() => {
		if (timelockListResponse && timelockListResponse.success && timelockListResponse.data) {
			const compoundTimelocks: TimelockContractItem[] =
				timelockListResponse.data.compound_timelocks.map(
					(timelock: TimelockContractItem): TimelockContractItem => ({
						...timelock,
						standard: 'compound' as const,
					})
				);
			const openzeppelinTimelocks: TimelockContractItem[] =
				timelockListResponse.data.openzeppelin_timelocks.map(
					(timelock: TimelockContractItem): TimelockContractItem => ({
						...timelock,
						standard: 'openzeppelin' as const,
					})
				);
			const combinedTimelocks = [...compoundTimelocks, ...openzeppelinTimelocks];
			setAllTimelocks(combinedTimelocks);
		}
	}, [timelockListResponse, setAllTimelocks]);

	if (isLoading) {
		return (
			<PageLayout title={t('title')}>
				<div className='bg-white'>
					<div className='mx-auto'>
						<TableSkeleton rows={5} columns={7} showHeader={true} />
					</div>
				</div>
			</PageLayout>
		);
	}

	const hasTimelocks = allTimelocks.length > 0;

	return (
		<PageLayout title={t('title')}>
			{hasTimelocks ?
				<TimelockContractTable data={allTimelocks} onDataUpdate={refetchTimelocks} />
			:	<AddTimelockContractSection />}
		</PageLayout>
	);
};

export default Timelocks;
