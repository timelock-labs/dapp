"use client"
import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import SearchBar from '@/components/ui/SearchBar';
import ExportButton from '@/components/ui/ExportButton';
import TabbedNavigation from './TabbedNavigation';
import TableComponent from '@/components/ui/TableComponent';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import * as XLSX from 'xlsx';

// Define Transaction type specific to this table
interface HistoryTxRow {
  id: number;
  chain_name: string;
  description: string;
  timelock_address: string;
  tx_hash: string;
  status: string;
  chainIcon: React.ReactNode;
}

const getHistoryTxTypeStyle = (type: string) => {
  switch (type) {
    case 'executed': return 'bg-green-100 text-green-800';
    case 'expired': return 'bg-red-100 text-red-800';
    case 'canceled': return 'bg-gray-100 text-gray-800';
    case 'queued': return 'bg-blue-100 text-blue-800';
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

const TransactionHistorySection: React.FC = () => {
  const t = useTranslations('Transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [historyTxs, setHistoryTxs] = useState<HistoryTxRow[]>([]);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: historyTxsResponse, request: fetchHistoryTxs, error } = useApi();

  const handleTabChange = (tabId: string) => {
    console.log('activeTab:', tabId);
    setActiveTab(tabId);
  };

  // 使用 useCallback 来稳定 debouncedFetch 函数
  const debouncedFetch = useCallback(
    (url: string, options: ApiRequestOptions) => {
      const debouncedFn = debounce(() => {
        fetchHistoryTxs(url, options);
      }, 500);
      debouncedFn();
    },
    [fetchHistoryTxs]
  );

  // 创建获取数据的函数
  const fetchHistoryTransactions = useCallback(() => {
    if (accessToken) {
      let url = `/api/v1/transaction/list?page=1&page_size=10`;
      if (activeTab !== 'all') {
        url += `&status=${activeTab}`;
      }
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
  }, [accessToken, activeTab, searchQuery, debouncedFetch]);

  useEffect(() => {
    fetchHistoryTransactions();
  }, [fetchHistoryTransactions]);

  useEffect(() => {
    if (historyTxsResponse?.success === true) {
      setHistoryTxs(historyTxsResponse.data.transactions || []);
      // 移除成功toast，避免频繁提示
    } else if (historyTxsResponse?.success === false && historyTxsResponse.data !== null) {
      toast.error(t('fetchHistoryTxsError'));
    }
  }, [historyTxsResponse, t]);

  useEffect(() => {
    if (error) {
      console.error('API Error:', error);
    }
  }, [error]);

  const historyTabs = [
    { id: 'all', label: t('all') },
    { id: 'queued', label: t('queued') },
    { id: 'executed', label: t('executed') },
    { id: 'expired', label: t('expired') },
    { id: 'canceled', label: t('canceled') },
  ];

  const columns = [
    {
      key: 'chain_name',
      header: t('chain'),
      render: (row: HistoryTxRow) => (
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
      render: (row: HistoryTxRow) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getHistoryTxTypeStyle(row.status)}`}>
          {row.status}
        </span>
      ),
    },
  ];

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(historyTxs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction History");
    XLSX.writeFile(workbook, "transaction-history.xlsx");
  };

  return (
    <div className="bg-white border border-gray-200 flex flex-col h-[400px] px-6">
      <div className="h-[152px] flex flex-col justify-between pt-6 pb-4">
        <div>
          <SectionHeader
            title={t('history')}
            description={t('transactionHistory')}
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <TabbedNavigation tabs={historyTabs} activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
          <div className="flex items-center space-x-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search" />
            <ExportButton onClick={handleExport} disabled={historyTxs.length === 0} />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden h-[300px]">
        <TableComponent<HistoryTxRow>
          columns={columns}
          data={historyTxs}
          showPagination={false}
        />
      </div>
    </div>
  );
};

export default TransactionHistorySection;