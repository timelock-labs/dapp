"use client"
import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import SearchBar from '@/components/ui/SearchBar';
import NewButton from '@/components/ui/NewButton';
import TableComponent from '@/components/ui/TableComponent';
import { useTransactionApi, Transaction } from '@/hooks/useTransactionApi';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { formatTimeRemaining, formatAddress } from '@/lib/utils';

// Define Transaction type specific to this table
interface PendingTxRow {
  id: number;
  chain_name: string;
  description: string;
  timelock_address: string;
  tx_hash: string;
  status: string;
  eta: number;
  time_remaining: number;
  creator_address: string;
  operations: React.ReactNode;
  chainIcon: React.ReactNode;
  can_cancel: boolean;
  can_execute: boolean;
  can_retry_submit: boolean;
}

const getPendingTxTypeStyle = (type: string) => {
  switch (type) {
    case 'queued': return 'bg-blue-100 text-blue-800';
    case 'ready': return 'bg-green-100 text-green-800';
    case 'executing': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    case 'submit_failed': return 'bg-red-100 text-red-800';
    case 'submitting': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const PendingTransactionsSection: React.FC = () => {
  const t = useTranslations('Transactions');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingTxs, setPendingTxs] = useState<PendingTxRow[]>([]);
  const [, setIsLoading] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  
  const {
    getPendingTransactions,
    cancelTransaction,
    executeTransaction,
    retrySubmitTransaction
  } = useTransactionApi();

  // Fetch pending transactions
  const fetchPendingTransactions = useCallback(async () => {
    if (!accessToken) return;
    
    setIsLoading(true);
    try {
      const response = await getPendingTransactions({
        page: 1,
        page_size: 10,
        // Add search functionality if needed
      });
      
      const transformedData: PendingTxRow[] = (response?.transactions || []).map((tx: Transaction) => ({
        ...tx,
        chainIcon: <div className="w-4 h-4 bg-gray-300 rounded-full" />, // Placeholder icon
        operations: null, // Will be rendered by column render function
      }));
      
      setPendingTxs(transformedData);
    } catch (error) {
      console.error('Failed to fetch pending transactions:', error);
      toast.error(t('fetchPendingTxsError'));
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, getPendingTransactions, t]);

  useEffect(() => {
    fetchPendingTransactions();
  }, [fetchPendingTransactions]);

  const handleCancel = async (id: number) => {
    try {
      await cancelTransaction(id);
      toast.success(t('cancelSuccess'));
      await fetchPendingTransactions(); // Refresh data
    } catch (error) {
      console.error('Cancel failed:', error);
      toast.error(t('cancelError'));
    }
  };

  const handleExecute = async (id: number) => {
    try {
      // For now, we'll use a placeholder transaction hash
      // In a real implementation, this would come from the blockchain interaction
      const executeTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      await executeTransaction(id, {
        execute_tx_hash: executeTxHash
      });
      toast.success(t('executeSuccess'));
      await fetchPendingTransactions(); // Refresh data
    } catch (error) {
      console.error('Execute failed:', error);
      toast.error(t('executeError'));
    }
  };

  const handleRetrySubmit = async (id: number) => {
    try {
      // For now, we'll use a placeholder transaction hash
      // In a real implementation, this would come from the blockchain interaction
      const newTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      await retrySubmitTransaction(id, newTxHash);
      toast.success(t('retrySubmitSuccess'));
      await fetchPendingTransactions(); // Refresh data
    } catch (error) {
      console.error('Retry submit failed:', error);
      toast.error(t('retrySubmitError'));
    }
  };

  

  const columns = [
    {
      key: 'chain_name',
      header: t('chain'),
      render: (row: PendingTxRow) => (
        <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
          {row.chainIcon}
          <span className="text-gray-800">{row.chain_name}</span>
        </div>
      ),
    },
    { 
      key: 'description', 
      header: t('description'),
      render: (row: PendingTxRow) => (
        <span className="max-w-xs truncate" title={row.description}>
          {row.description || 'No description'}
        </span>
      )
    },
    { 
      key: 'timelock_address', 
      header: t('timelockAddress'),
      render: (row: PendingTxRow) => (
        <span className="font-mono text-sm" title={row.timelock_address}>
          {formatAddress(row.timelock_address)}
        </span>
      )
    },
    { 
      key: 'tx_hash', 
      header: t('txHash'),
      render: (row: PendingTxRow) => (
        <span className="font-mono text-sm" title={row.tx_hash}>
          {formatAddress(row.tx_hash)}
        </span>
      )
    },
    {
      key: 'status',
      header: t('status'),
      render: (row: PendingTxRow) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPendingTxTypeStyle(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'time_remaining',
      header: 'Time Remaining',
      render: (row: PendingTxRow) => (
        <span className="text-sm text-gray-600">
          {formatTimeRemaining(row.time_remaining)}
        </span>
      ),
    },
    {
      key: 'operations',
      header: t('operations'),
      render: (row: PendingTxRow) => (
        <div className="flex space-x-2">
          {row.can_cancel && (
            <button
              type="button"
              onClick={() => handleCancel(row.id)}
              className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-100 transition-colors"
            >
            Cancel
            </button>
          )}
          {row.can_execute && (
            <button
              type="button"
              onClick={() => handleExecute(row.id)}
              className="text-green-500 hover:text-green-700 p-1 rounded-md hover:bg-green-100 transition-colors"
            >
              {t('execute')}
            </button>
          )}
          {row.can_retry_submit && row.status === 'submit_failed' && (
            <button
              type="button"
              onClick={() => handleRetrySubmit(row.id)}
              className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-100 transition-colors"
            >
              {t('retry')}
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleNew = () => {
    router.push('/create-transaction'); // Navigate to create transaction page
  };

  return (
    <div className="bg-white rounded-xl  p-6 border border-gray-200 flex flex-col h-[400px] pt-0 pb-0">
      <div className="flex justify-between items-center h-[100px] mb-4 p-0">
        <div>
          <SectionHeader
            title={t('pending')}
            description={t('pendingTransactions')}
          />
        </div>
        <div className="flex items-center space-x-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search" />
          <NewButton onClick={handleNew} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <TableComponent<PendingTxRow>
          columns={columns}
          data={pendingTxs}
          showPagination={false}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
};

export default PendingTransactionsSection;