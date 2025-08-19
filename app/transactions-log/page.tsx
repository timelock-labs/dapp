'use client';
import React, { useState, useEffect, useCallback } from 'react';
import TableComponent from '@/components/ui/TableComponent';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import type { Transaction, BaseComponentProps, TransactionStatus, ContractStandard, Hash, Address, Timestamp } from '@/types';
import Image from 'next/image';
import { useApi } from '@/hooks/useApi';
import { formatAddress } from '@/utils/utils';
import copyToClipboard from '@/utils/copy';
import getHistoryTxTypeStyle from '@/utils/getHistoryTxTypeStyle';
import SectionCard from '@/components/layout/SectionCard';
import EthereumParamsCodec from '@/utils/ethereumParamsCodec';
import { Copy } from 'lucide-react';

// Define Transaction type specific to this table
interface HistoryTxRow {
	id: number;
	flow_id: Hash;
	timelock_standard: ContractStandard;
	chain_id: number;
	contract_address: Address;
	contract_remark: string;
	function_signature: string;
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
	function_signature: string;
}

/**
 * Transaction history section component with filtering and export functionality
 *
 * @param props - TransactionHistorySection component props
 * @returns JSX.Element
 */
const TransactionHistorySection: React.FC<BaseComponentProps> = () => {
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
		const ethereumParamsCodec = new EthereumParamsCodec();

		const decodeResult = ethereumParamsCodec.decodeParams(
			funcSig,
			calldata
		);

		const paramsArr = decodeResult.params

		return paramsArr
	};

	const getNativeTokenSymbol = (chainId: number) => {
		const chain = chains?.find(c => c.chain_id === chainId);
		return chain?.native_currency_symbol;
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
			key: 'remark',
			header: t('remark'),
			render: (row: HistoryTxRow) => <span className={`text-sm`}>{row.contract_remark}</span>,
		},
		{
			key: 'contract_address',
			header: t('timelock'),
			render: (row: HistoryTxRow) => (
				<div className='flex items-center space-x-2'>
					<span className='text-sm'>{row.contract_address}</span>
					<Copy
						className='h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700'
						onClick={() => {
							copyToClipboard(row.contract_address);
						}}
					/>
				</div>
			),
		},
		{
			key: 'tx_hash',
			header: t('txHash'),
			render: (row: HistoryTxRow) => (
				<div className='flex items-center space-x-2'>
					<span className='text-sm cursor-pointer' onClick={() => copyToClipboard(row.queue_tx_hash)}>
						{formatAddress(row.queue_tx_hash)}
					</span>
					<Copy
						className='h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700'
						onClick={() => {
							copyToClipboard(row.queue_tx_hash);
						}}
					/>
				</div>
			),
		},
		{
			key: 'function_signature',
			header: t('functionSignature'),
			render: (row: HistoryTxRow) => (
				<div className='flex items-center space-x-2'>
					<span className='text-sm cursor-pointer' onClick={() => copyToClipboard(row.function_signature)}>
						{row.function_signature}
					</span>
					<Copy
						className='h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700'
						onClick={() => {
							copyToClipboard(row.function_signature);
						}}
					/>
				</div>
			),
		},
		{
			key: 'call_data_hex',
			header: t('callDataHex'),
			render: (row: HistoryTxRow) => (
				<div className='flex flex-col'>
					{parseCalldata(row.function_signature, row.call_data_hex).map((item) => (
						<div key={item.index} className='flex text-sm'>
							<div className='font-medium'>{item.type}:</div>
							<div className='ml-1'>{item.value}</div>
						</div>
					))}
				</div>
			),
		},
		{
			key: 'value',
			header: t('value'),
			render: (row: HistoryTxRow) => (
				<div className='flex items-center space-x-2'>
					<span className='text-sm cursor-pointer' onClick={() => copyToClipboard(row.value)}>
						{row.value}  {getNativeTokenSymbol(row.chain_id)}
					</span>
					<Copy
						className='h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700'
						onClick={() => {
							copyToClipboard(row.value);
						}}
					/>
				</div>
			),
		},
		{
			key: 'status',
			header: t('status'),
			render: (row: HistoryTxRow) => (
				<span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getHistoryTxTypeStyle(row.status)}`}>{row.status}</span>
			),
		},
	];

	return (
		<SectionCard>
			<div className='flex-1 mb-4'>
				<TableComponent<HistoryTxRow> columns={columns} data={historyTxs} showPagination={true} itemsPerPage={10} />
			</div>
		</SectionCard>
	);
};

export default TransactionHistorySection;
