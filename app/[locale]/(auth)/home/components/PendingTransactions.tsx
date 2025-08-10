// components/PendingTransactions.tsx
"use client"
import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import TableComponent from '@/components/ui/TableComponent';
import { useTransactionApi, Transaction } from '@/hooks/useTransactionApi';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
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

const PendingTransactions: React.FC = () => {
  const t = useTranslations('Transactions');
  const [pendingTxs, setPendingTxs] = useState<PendingTxRow[]>([]);
  const [, setIsLoading] = useState(false);
  
  const { getPendingTransactions } = useTransactionApi();

  // Fetch pending transactions
  const fetchPendingTransactions = useCallback(async () => {    
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
  }, [getPendingTransactions, t]);

  useEffect(() => {
    fetchPendingTransactions();
  }, [fetchPendingTransactions]);

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
      header: 'End Time',
      render: (row: PendingTxRow) => (
        <span className="text-sm text-gray-600">
          {formatTimeRemaining(row.time_remaining)}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col h-full">
      <div className="mb-4">
        <SectionHeader
          title="Pending Transactions"
          description="View your pending transactions"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <TableComponent<PendingTxRow>
          columns={columns}
          data={pendingTxs}
          showPagination={true}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
};

export default PendingTransactions;