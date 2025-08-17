'use client';
import React, { useState, useEffect, useCallback } from 'react';
import TableComponent from '@/components/ui/TableComponent';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import * as XLSX from 'xlsx';
import type { Transaction, BaseComponentProps, TransactionStatus, ContractStandard, Hash, Address, Timestamp } from '@/types';
import Image from 'next/image';
import { useApi } from '@/hooks/useApi';
import { formatDate, formatAddress } from '@/utils/utils';
import copyToClipboard from '@/utils/copy';
import PageLayout from '@/components/layout/PageLayout';
import getHistoryTxTypeStyle from '@/utils/getHistoryTxTypeStyle';
import { ethers } from 'ethers';

// Define Transaction type specific to this table
interface HistoryTxRow {
	id: number;
	flow_id: Hash;
	timelock_standard: ContractStandard;
	chain_id: number;
	contract_address: Address;
	status: TransactionStatus;
	queue_tx_hash: Hash;
	initiator_address: Address;
	target_address: Address;
	call_data_hex: string;
	value: string;
	eta: Timestamp;
	expired_at: Timestamp;
	created_at: Timestamp;
	updated_at: Timestamp;
	chainIcon: React.ReactNode;
}

/**
 * Transaction history section component with filtering and export functionality
 *
 * @param props - TransactionHistorySection component props
 * @returns JSX.Element
 */
const TransactionHistorySection: React.FC<BaseComponentProps> = ({ className }) => {
	const t = useTranslations('Transactions_log');
	const [historyTxs, setHistoryTxs] = useState<HistoryTxRow[]>([]);
	const chains = useAuthStore(state => state.chains);

	const { request: getTransactionList } = useApi();


	// Fetch transaction history
	const fetchHistoryTransactions = useCallback(async () => {
		try {
			const { data } = await getTransactionList('/api/v1/flows/list', {
				page: 1,
				page_size: 10,
				status: 'all',
			});

			const transformedData: HistoryTxRow[] = data.flows.map((tx: Transaction) => ({
				...tx,
				chainIcon: <div className='w-4 h-4 bg-gray-300 rounded-full' />, // Placeholder icon
			}));

			setHistoryTxs(transformedData);
		} catch (error) {
			console.error('Failed to fetch transaction history:', error);
			toast.error(t('fetchHistoryTxsError'));
		}
	}, [getTransactionList, t]);

	useEffect(() => {
		fetchHistoryTransactions();
	}, [fetchHistoryTransactions]);


	const parseCalldata = (funcSig: string, calldata: string) => {
		if (!funcSig || !calldata) return '';
		const funcParams = funcSig
			.split('(')[1]
			.split(')')[0]
			.split(',')
			.map(p => p.trim());

		const calldataParams = ethers.utils.defaultAbiCoder.decode(funcParams, calldata);

		return Object.fromEntries(
			funcParams.map((p, i) => [p, calldataParams[i]])
		);
	};

	const columns = [
		{
			key: 'chain',
			header: t('chain'),
			render: (row: HistoryTxRow) => {
				// 尝试通过 chain_name 找到对应的链
				const chain = chains?.find(c => c.chain_id === row.chain_id || c.display_name === row.chain_name);
				const chainLogo = chain?.logo_url || '';
				const chainName = chain?.display_name || row.chain_name;

				return (
					<div className='inline-flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1'>
						{chainLogo && (
							<Image
								src={chainLogo}
								alt={chainName}
								width={16}
								height={16}
								className='rounded-full'
								onError={e => {
									e.currentTarget.style.display = 'none';
								}}
							/>
						)}
						<span className='text-gray-800 font-medium'>{chainName}</span>
					</div>
				);
			},
		},
		{
			key: 'tx_hash',
			header: t('txHash'),
			render: (row: HistoryTxRow) => (
				<div className='flex items-center space-x-2'>
					<span className='text-sm cursor-pointer' onClick={() => copyToClipboard(row.queue_tx_hash)}>{formatAddress(row.queue_tx_hash)}</span>
				</div>
			),
		},
		{
			key: "function_signature",
			header: t('functionSignature'),
			render: (row: HistoryTxRow) => (
				<div className='flex items-center space-x-2'>
					<span className='text-sm cursor-pointer' onClick={() => copyToClipboard(row.function_signature)}>{row.function_signature}</span>
				</div>
			)
		},
		{
			key: "call_data_hex",
			header: t('callDataHex'),
			render: (row: HistoryTxRow) => (
				<div className='flex flex-col'>
					{Object.entries(parseCalldata(row.function_signature, row.call_data_hex)).map(([key, value]) => (
						<div key={key} className='flex text-sm'>
							<div className='font-medium'>{key.toString()}:</div>
							<div className='ml-1'>{value.toString()}</div>
						</div>
					))}
				</div>
			)
		},
		{
			key: "value",
			header: t('value'),
			render: (row: HistoryTxRow) => (
				<div className='flex items-center space-x-2'>
					<span className='text-sm cursor-pointer' onClick={() => copyToClipboard(row.value)}>{row.value}</span>
				</div>
			)
		},
		{
			key: 'status',
			header: t('status'),
			render: (row: HistoryTxRow) => (
				<span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getHistoryTxTypeStyle(row.status)}`}>{row.status}</span>
			),
		}
	];

	const handleExport = () => {
		if (historyTxs.length === 0) {
			toast.warning('No data to export');
			return;
		}

		try {
			const worksheet = XLSX.utils.json_to_sheet(historyTxs);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaction History');

			// Generate filename with current date
			const now = new Date();
			const timestamp = now.toISOString().split('T')[0]; // YYYY-MM-DD format
			const filename = `transaction-history-${timestamp}.xlsx`;

			XLSX.writeFile(workbook, filename);
			toast.success('Transaction history exported successfully');
		} catch (error) {
			console.error('Export failed:', error);
			toast.error('Failed to export transaction history');
		}
	};

	return (
		<PageLayout title={t('title')}>
			<div className='flex-1 mb-4'>
				<TableComponent<HistoryTxRow> columns={columns} data={historyTxs} showPagination={true} itemsPerPage={10} />
			</div>
		</PageLayout>
	);
};

export default TransactionHistorySection;
