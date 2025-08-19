'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import TableComponent from '@/components/ui/TableComponent';
import SectionHeader from '@/components/ui/SectionHeader';
import { useRouter, useParams } from 'next/navigation';
import { formatDate } from '@/utils/utils';
import { formatSecondsToLocalizedTime } from '@/utils/timeUtils';
import DeleteButton from '@/components/ui/DeleteButton';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { Copy, Network } from 'lucide-react';
import type { TimelockContractItem, BaseComponentProps, VoidCallback } from '@/types';
import copyToClipboard from '@/utils/copy';
import ChainLabel from '@/components/ui/ChainLabel';

// Define the props for the component
interface TimelockContractTableProps extends BaseComponentProps {
	data: TimelockContractItem[];
	onDataUpdate?: VoidCallback;
}

const getStatusBadgeStyle = (status: string) => {
	switch (status.toLowerCase()) {
		case 'active':
			return 'text-emerald-600 font-medium';
		case 'pending':
			return 'text-amber-600 font-medium';
		default:
			return 'text-slate-600 font-medium';
	}
};

/**
 * Timelock contract table component with CRUD operations
 *
 * @param props - TimelockContractTable component props
 * @returns JSX.Element
 */
const TimelockContractTable: React.FC<TimelockContractTableProps> = ({ data, onDataUpdate, className }) => {
	const t = useTranslations('TimelockTable');
	const router = useRouter();
	const params = useParams();
	const locale = params.locale as string;
	const chains = useAuthStore(state => state.chains);

	const { data: deleteResponse, request: deleteContract } = useApi();

	const handleImportContract = () => {
		router.push(`/import-timelock`);
	};

	const handleCreateContract = () => {
		router.push(`/create-timelock`);
	};

	const handleDeleteContract = async (contract: TimelockContractItem) => {
		const standard = contract.standard || 'compound'; // 默认使用 compound 标准
		await deleteContract(`/api/v1/timelock/delete`, {
			standard,
			contract_address: contract.contract_address,
			chain_id: contract.chain_id,
		});
	};

	useEffect(() => {
		if (deleteResponse?.success === true) {
			toast.success(t('deleteSuccess'));
			if (onDataUpdate) {
				onDataUpdate();
			}
		} else if (deleteResponse?.success === false && deleteResponse.data !== null) {
			console.error('Failed to delete contract:', deleteResponse.error);
			toast.error(t('deleteError', { message: deleteResponse.error?.message || t('unknown') }));
		}
	}, [deleteResponse, onDataUpdate, t]);

	const columns = [
		{
			key: 'chain',
			header: t('chain'),
			render: (row: TimelockContractItem) => <ChainLabel chainId={row.chain_id} />,
		},
		{
			key: 'name',
			header: t('name'),
			render: (row: TimelockContractItem) => <span className={`text-sm ${getStatusBadgeStyle(row.status)}`}>{row.remark}</span>,
		},
		{
			key: 'contract_address',
			header: t('timelock'),
			render: (row: TimelockContractItem) => (
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
			key: 'admin',
			header: t('owner'),
			render: (row: TimelockContractItem) => (
				<div className='flex items-center space-x-2'>
					<span className='text-sm cursor-pointer' onClick={() => copyToClipboard(row.admin)}>{row.admin}</span>
				</div>
			),
		},
		{
			key: 'user_permissions',
			header: t('userPermissions'),
			render: (row: TimelockContractItem) => {
				const permissions = (row as TimelockContractItem & { user_permissions?: string[] }).user_permissions;

				if (!permissions || permissions.length === 0) {
					return <span className='text-gray-500'>{t('none')}</span>;
				}

				const getRoleStyle = (role: string) => {
					switch (role.toLowerCase()) {
						case 'creator':
							return 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200 shadow-sm';
						case 'admin':
							return 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm';
						case 'admincreator':
							return 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm';
						default:
							return 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border border-slate-200 shadow-sm';
					}
				};

				const getRoleDisplayName = (role: string) => {
					switch (role.toLowerCase()) {
						case 'admin':
							return 'Admin';
						case 'creator':
							return 'Creator';
						case 'admincreator':
							return 'Admin & Creator';
						default:
							return role;
					}
				};

				return (
					<div className='flex flex-wrap gap-2'>
						{permissions.map((permission, index) => (
							permission !=="creator" && (
							<span
								key={index}
								className={`px-3 py-1.5 inline-flex items-center text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105 ${getRoleStyle(permission)}`}>
								<span className='w-1.5 h-1.5 rounded-full bg-current opacity-60 mr-1.5'></span>
								{getRoleDisplayName(permission)}
							</span>)
						))}
					</div>
				);
			},
		},
		{
			key: 'delay',
			header: t('minDelay'),
			render: (row: TimelockContractItem) => {
				const delay = (row as TimelockContractItem & { delay?: number }).delay;
				if (!delay) return '-';

				const formattedTime = formatSecondsToLocalizedTime(delay, locale === 'zh' ? 'zh' : 'en');
				return (
					<span className='font-mono'>
						{formattedTime}
					</span>
				);
			},
		},
		{
			key: 'operations',
			header: t('operations'),
			render: (row: TimelockContractItem) => (
				<div className='flex items-center justify-center'>
					<DeleteButton
						onDelete={() => handleDeleteContract(row)}
						title={t('deleteTitle')}
						description={t('deleteDescription', { name: row.remark || t('unknown') })}
						confirmText={t('deleteConfirm')}
						cancelText={t('deleteCancel')}
						variant='destructive'
						size='sm'
					/>
				</div>
			),
		},
	];

	return (
		<div className={`bg-white ${className || ''}`}>
			<div className='mx-auto'>
				<div className='flex items-center mb-6'>
					<div className='flex-grow'>
						<SectionHeader title={t('title')} description={t('description')} />
					</div>
					<div className='flex transform -translate-y-2.5'>
						<button
							type='button'
							onClick={handleImportContract}
							className='bg-white text-gray-900 px-4 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors text-sm cursor-pointer'>
							{t('importExistingContract')}
						</button>
						<button
							type='button'
							onClick={handleCreateContract}
							className='ml-2.5 bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors text-sm cursor-pointer'>
							{t('createNewContract')}
						</button>
					</div>
				</div>
				<TableComponent<TimelockContractItem> columns={columns} data={data} showPagination={true} itemsPerPage={5} />
			</div>
		</div>
	);
};

export default TimelockContractTable;
