"use client"
import React, { useState, useEffect, useCallback } from 'react';
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
  can_cancel: boolean;
  can_execute: boolean;
}

const getPendingTxTypeStyle = (type: string) => {
  switch (type) {
    case 'queued': return 'bg-gray-100 text-gray-800';
    case 'ready': return 'bg-black text-white';
    default: return 'bg-gray-100 text-gray-800';
  }
};

import debounce from 'lodash.debounce';

// 导入API请求选项类型
interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

const PendingTransactionsSection: React.FC = () => {
  const t = useTranslations('Transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingTxs, setPendingTxs] = useState<PendingTxRow[]>([]);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: pendingTxsResponse, request: fetchPendingTxs, error } = useApi();

  // 使用 useCallback 来稳定 debouncedFetch 函数  
  const debouncedFetch = useCallback(
    (url: string, options: ApiRequestOptions) => {
      const debouncedFn = debounce(() => {
        fetchPendingTxs(url, options);
      }, 500);
      debouncedFn();
    },
    [fetchPendingTxs]
  );

  // 创建获取数据的函数
  const fetchPendingTransactions = useCallback(() => {
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
    fetchPendingTransactions();
  }, [fetchPendingTransactions]);

  useEffect(() => {
    if (pendingTxsResponse?.success === true) {
      setPendingTxs(pendingTxsResponse.data.transactions || []);
      // 移除成功toast，避免频繁提示
    } else if (pendingTxsResponse?.success === false && pendingTxsResponse.data !== null) {
      toast.error(t('fetchPendingTxsError'));
    }
  }, [pendingTxsResponse, t]);

  useEffect(() => {
    if (error) {
      console.error('API Error:', error);
    }
  }, [error]);

  const { data: cancelResponse, request: cancelTx, error: cancelError } = useApi();
  const { data: executeResponse, request: executeTx, error: executeError } = useApi();

  const handleCancel = async (id: number) => {
    if (accessToken) {
      await cancelTx(`/api/v1/transaction/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    }
  };

  const handleExecute = async (id: number) => {
    if (accessToken) {
      await executeTx(`/api/v1/transaction/${id}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    }
  };

  useEffect(() => {
    if (cancelResponse?.success === true) {
      toast.success(t('cancelSuccess'));
      // 刷新数据
      fetchPendingTransactions();
    } else if (cancelResponse?.success === false && cancelResponse.data !== null) {
      toast.error(t('cancelError'));
    }
  }, [cancelResponse, t, fetchPendingTransactions]);

  useEffect(() => {
    if (executeResponse?.success === true) {
      toast.success(t('executeSuccess'));
      // 刷新数据
      fetchPendingTransactions();
    } else if (executeResponse?.success === false && executeResponse.data !== null) {
      toast.error(t('executeError'));
    }
  }, [executeResponse, t, fetchPendingTransactions]);

  useEffect(() => {
    if (cancelError) {
      console.error('Cancel API Error:', cancelError);
      toast.error(t('cancelError'));
    }
  }, [cancelError, t]);

  useEffect(() => {
    if (executeError) {
      console.error('Execute API Error:', executeError);
      toast.error(t('executeError'));
    }
  }, [executeError, t]);

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
        <div className="flex space-x-2">
          {row.can_cancel && (
            <button
              type="button"
              onClick={() => handleCancel(row.id)}
              className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-100 transition-colors"
            >
              {t('cancel')}
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
        </div>
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