"use client"
import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import SearchBar from '@/components/ui/SearchBar';
import NewButton from '@/components/ui/NewButton';
import TableComponent from '@/components/ui/TableComponent';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

// Define Transaction type specific to this table
interface PendingTxRow {
  id: number;
  chain_name: string;
  description: string;
  timelock_address: string;
  tx_hash: string;
  status: string;
  operations: React.ReactNode;
  chainIcon: React.ReactNode;
}

const getPendingTxTypeStyle = (type: string) => {
  switch (type) {
    case 'queued': return 'bg-gray-100 text-gray-800';
    case 'ready': return 'bg-black text-white';
    default: return 'bg-gray-100 text-gray-800';
  }
};

import debounce from 'lodash.debounce';

const PendingTransactionsSection: React.FC = () => {
  const t = useTranslations('Transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingTxs, setPendingTxs] = useState<PendingTxRow[]>([]);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: pendingTxsResponse, request: fetchPendingTxs, error } = useApi();

  const debouncedFetch = debounce((url: string, options: RequestInit) => {
    fetchPendingTxs(url, options);
  }, 500);

  useEffect(() => {
    if (accessToken) {
      let url = `/api/v1/transaction/pending?page=1&page_size=10`;
      if (searchQuery) {
        url += `&q=${searchQuery}`;
      }
      debouncedFetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    }
  }, [accessToken, searchQuery, debouncedFetch]);

  useEffect(() => {
    if (pendingTxsResponse && pendingTxsResponse.success) {
      setPendingTxs(pendingTxsResponse.data.transactions);
      toast.success(t('fetchPendingTxsSuccess'));
    } else if (pendingTxsResponse && !pendingTxsResponse.success) {
      toast.error(t('fetchPendingTxsError'));
    }
  }, [pendingTxsResponse, t]);

  useEffect(() => {
    if (error) {
      console.error('API Error:', error);
    }
  }, [error]);

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
    { key: 'description', header: t('tagRemark') },
    { key: 'timelock_address', header: t('timelockAddress') },
    { key: 'tx_hash', header: t('txHash') },
    {
      key: 'status',
      header: t('type'),
      render: (row: PendingTxRow) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPendingTxTypeStyle(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'operations',
      header: t('operations'),
      render: (row: PendingTxRow) => (
        <button onClick={() => console.log('Operations for:', row.id)} className="text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors">
          ...
        </button>
      ),
    },
  ];

  const handleNew = () => console.log('New clicked!');

  return (
    <div className="bg-white p-6 border border-gray-200 flex flex-col h-[400px] pt-0 pb-0">
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
        />
      </div>
    </div>
  );
};

export default PendingTransactionsSection;