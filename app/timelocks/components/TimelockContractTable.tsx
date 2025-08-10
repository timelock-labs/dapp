'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import TableComponent from '@/components/ui/TableComponent';
import SectionHeader from '@/components/ui/SectionHeader';
import { useRouter, useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import DeleteButton from '@/components/ui/DeleteButton';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { Network } from 'lucide-react';
import type { TimelockContractItem, BaseComponentProps, VoidCallback } from '@/types';

// Define the props for the component
interface TimelockContractTableProps extends BaseComponentProps {
  data: TimelockContractItem[];
  onDataUpdate?: VoidCallback;
}

const getStatusBadgeStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

/**
 * Timelock contract table component with CRUD operations
 *
 * @param props - TimelockContractTable component props
 * @returns JSX.Element
 */
const TimelockContractTable: React.FC<TimelockContractTableProps> = ({
  data,
  onDataUpdate,
  className,
}) => {
  const t = useTranslations('TimelockTable');
  const router = useRouter();
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
      method: 'DELETE',
      body:{
        standard,
        contract_address: contract.contract_address,
        chain_id: contract.chain_id,
      }
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
      render: (row: TimelockContractItem) => {
        // 尝试通过 chain_name 找到对应的链
        const chain = chains?.find(
          c => c.chain_name === row.chain_name || c.display_name === row.chain_name
        );
        const chainLogo = chain?.logo_url || '';
        const chainName = chain?.display_name || row.chain_name;

        return (
          <div className='inline-flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1'>
            {chainLogo ? (
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
            ) : (
              <Network className='h-4 w-4 text-gray-700' />
            )}
            <span className='text-gray-800 font-medium'>{chainName}</span>
          </div>
        );
      },
    },
    {
      key: 'name',
      header: t('name'),
      render: (row: TimelockContractItem) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(
            row.status
          )}`}
        >
          {row.remark}
        </span>
      ),
    },
    {
      key: 'contract_address',
      header: t('timelock'),
    },
    {
      key: 'admin',
      header: t('owner'),
      render: (row: TimelockContractItem) => row.admin,
    },
    {
      key: 'user_permissions',
      header: t('userPermissions'),
      render: (row: TimelockContractItem) => (row as TimelockContractItem & { user_permissions?: string[] }).user_permissions?.join(', ') || t('none'),
    },
    {
      key: 'min_delay',
      header: t('minDelay'),
      render: (row: TimelockContractItem) => (row as TimelockContractItem & { min_delay?: number }).min_delay,
    },
    {
      key: 'created_at',
      header: t('addedAt'),
      render: (row: TimelockContractItem) => formatDate(row.created_at),
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
              className='bg-white text-gray-900 px-4 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors text-sm cursor-pointer'
            >
              {t('importExistingContract')}
            </button>
            <button
              type='button'
              onClick={handleCreateContract}
              className='ml-2.5 bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors text-sm cursor-pointer'
            >
              {t('createNewContract')}
            </button>
          </div>
        </div>
        <TableComponent<TimelockContractItem>
          columns={columns}
          data={data}
          showPagination={true}
          itemsPerPage={5}
        />
      </div>
    </div>
  );
};

export default TimelockContractTable;
