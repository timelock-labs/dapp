// components/PendingTransactions.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import TableComponent from '@/components/ui/TableComponent';
import { useTranslations } from 'next-intl';
import { formatAddress } from '@/lib/utils';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/userStore';
import { Network } from 'lucide-react';
import Image from 'next/image';
import getHistoryTxTypeStyle from '@/utils/getHistoryTxTypeStyle';
import { formatDate } from '@/lib/utils';

const PendingTransactions: React.FC = () => {
	const t = useTranslations('Transactions');
	const [pendingTxs, setPendingTxs] = useState<any[]>([]);

	const { request: getPendingTransactions } = useApi();
	const chains = useAuthStore(state => state.chains);

	const fetchPendingTransactions = useCallback(async () => {
		try {
			const { data:waitingData } = await getPendingTransactions('/api/v1/flows/list', { page: 1, page_size: 50, standard: 'compound', status: 'waiting' });
			const { data:executedData } = await getPendingTransactions('/api/v1/flows/list', { page: 1, page_size: 50, standard: 'compound', status: 'ready' });

			const transformedData: any[] = [...waitingData.flows,...executedData.flows].map((tx: any) => ({
				...tx,
				chainIcon: <div className='w-4 h-4 bg-gray-300 rounded-full' />, // Placeholder icon
			}));
			setPendingTxs(transformedData);
		} catch (error) {
			console.error('Failed to fetch pending transactions:', error);
			toast.error(t('fetchPendingTxsError'));
		}
	}, [t]);

	useEffect(() => {
		fetchPendingTransactions();
	}, [fetchPendingTransactions]);

	const columns = [
		{
			key: 'chain',
			header: t('chain'),
			render: (row: any) => {
				// 尝试通过 chain_name 找到对应的链
				const chain = chains?.find(c => c.chain_id === row.chain_id || c.display_name === row.chain_name);
				const chainLogo = chain?.logo_url || '';
				const chainName = chain?.display_name || row.chain_name;

				return (
					<div className='inline-flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1'>
						{chainLogo ?
							<Image
								src={chainLogo}
								alt={chainName}
								width={16}
								height={16}
								className='rounded-full'
								onError={e => {
									console.error('Failed to load chain logo:', chainLogo);
									e.currentTarget.style.display = 'none';
								}}
							/>
						:	<Network className='h-4 w-4 text-gray-700' />}
						<span className='text-gray-800 font-medium'>{chainName}</span>
					</div>
				);
			},
		},
		{
			key: 'timelock_address',
			header: t('timelockAddress'),
			render: (row: any) => (
				<span className='font-mono text-sm' title={row.contract_address}>
					{formatAddress(row.contract_address)}
				</span>
			),
		},
		{
			key: 'tx_hash',
			header: t('txHash'),
			render: (row: any) => (
				<span className='font-mono text-sm' title={row.queue_tx_hash}>
					{formatAddress(row.queue_tx_hash)}
				</span>
			),
		},
		{
			key: 'created_at',
			header: t('createdAt'),
			render: (row: any) => <span className='text-sm text-gray-600'>{formatDate(row.created_at)}</span>,
		},
		{
			key: 'eta',
			header: t('eta'),
			render: (row: any) => <span className='text-sm text-gray-600'>{formatDate(row.eta)}</span>,
		},
		{
			key: 'expired_at',
			header: t('expiredAt'),
			render: (row: any) => <span className='text-sm text-gray-600'>{formatDate(row.expired_at)}</span>,
		},
		{
			key: 'status',
			header: t('status'),
			render: (row: any) => <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getHistoryTxTypeStyle(row.status)}`}>{row.status}</span>,
		},
	];

	return (
		<div className='bg-white rounded-xl p-6 border border-gray-200 flex flex-col h-full'>
			<div className='mb-4'>
				<SectionHeader title='Pending Transactions' description='View your pending transactions' />
			</div>
			<div className='flex-1 overflow-hidden'>
				<TableComponent<any> columns={columns} data={pendingTxs} showPagination={true} itemsPerPage={10} />
			</div>
		</div>
	);
};

export default PendingTransactions;
