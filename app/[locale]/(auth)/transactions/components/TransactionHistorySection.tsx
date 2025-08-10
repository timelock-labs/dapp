"use client"
import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import SearchBar from '@/components/ui/SearchBar';
import ExportButton from '@/components/ui/ExportButton';
import TabbedNavigation from './TabbedNavigation';
import TableComponent from '@/components/ui/TableComponent';
import { useTransactionApi } from '@/hooks/useTransactionApi';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import * as XLSX from 'xlsx';
import type { Transaction, BaseComponentProps, TransactionStatus, ContractStandard, Hash, Address, Timestamp } from '@/types';

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

const getHistoryTxTypeStyle = (type: string) => {
  switch (type) {
    case 'executed': return 'bg-green-100 text-green-800';
    case 'expired': return 'bg-red-100 text-red-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    case 'queued': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Transaction history section component with filtering and export functionality
 * 
 * @param props - TransactionHistorySection component props
 * @returns JSX.Element
 */
const TransactionHistorySection: React.FC<BaseComponentProps> = ({ className }) => {
  const t = useTranslations('Transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [historyTxs, setHistoryTxs] = useState<HistoryTxRow[]>([]);
  const accessToken = useAuthStore((state) => state.accessToken);

  const { getTransactionList } = useTransactionApi();

  const handleTabChange = (tabId: string) => {
    console.log('activeTab:', tabId);
    setActiveTab(tabId);
  };

  // Fetch transaction history
  const fetchHistoryTransactions = useCallback(async () => {
    if (!accessToken) return;

    try {
      const response = await getTransactionList({
        page: 1,
        page_size: 10,
        status: activeTab === 'all' ? undefined : activeTab as TransactionStatus,
        // Add search functionality if needed
      });

      const transformedData: HistoryTxRow[] = (response?.flows || []).map((tx: Transaction) => ({
        ...tx,
        chainIcon: <div className="w-4 h-4 bg-gray-300 rounded-full" />, // Placeholder icon
      }));

      setHistoryTxs(transformedData);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      toast.error(t('fetchHistoryTxsError'));
    }
  }, [accessToken, activeTab, getTransactionList, t]);

  useEffect(() => {
    fetchHistoryTransactions();
  }, [fetchHistoryTransactions]);

  // all, waiting, ready, executed, cancelled, expired
  const historyTabs = [
    { id: 'all', label: t('all') },
    { id: 'waiting', label: t('waiting') },
    { id: 'ready', label: t('ready') },
    { id: 'executed', label: t('executed') },
    { id: 'cancelled', label: t('cancelled') },
    { id: 'expired', label: t('expired') },
  ];

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${month} ${day}, ${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const columns = [
    {
      key: 'chain_name',
      header: t('chain'),
      render: (row: HistoryTxRow) => (
        <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
          {row.chainIcon}
          <span className="text-gray-800">{row.chain_id}</span>
        </div>
      ),
    },
    {
      key: 'timelock_address',
      header: t('timelockAddress'),
      render: (row: HistoryTxRow) => (
        <span className="font-mono text-sm" title={row.contract_address}>
          {formatAddress(row.contract_address)}
        </span>
      )
    },
    {
      key: 'tx_hash',
      header: t('txHash'),
      render: (row: HistoryTxRow) => (
        <span className="font-mono text-sm" title={row.queue_tx_hash}>
          {formatAddress(row.queue_tx_hash)}
        </span>
      )
    },
    {
      key: 'created_at',
      header: t('createdAt'),
      render: (row: HistoryTxRow) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      key:"eta",
      header: t('eta'),
      render: (row: HistoryTxRow) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.eta)}
        </span>
      ),
    },
    {
      key:"expired_at",
      header: t('expiredAt'),
      render: (row: HistoryTxRow) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.expired_at)}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('status'),
      render: (row: HistoryTxRow) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getHistoryTxTypeStyle(row.status)}`}>
          {row.status}
        </span>
      ),
    }
  ];

  const handleExport = () => {
    if (historyTxs.length === 0) {
      toast.warning('No data to export');
      return;
    }

    try {
      // Prepare data for export
      const exportData = historyTxs.map(tx => ({
        ID: tx.id,
        Chain: tx.chain_name,
        Description: tx.description || 'No description',
        'Timelock Address': tx.timelock_address,
        'Transaction Hash': tx.tx_hash,
        Status: tx.status,
        'Created At': formatDate(tx.created_at),
        'Completed At': formatDate(tx.executed_at || tx.canceled_at || ''),
        Creator: tx.creator_address,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction History");

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
    <div className={`rounded-xl bg-white border border-gray-200 flex flex-col h-[400px] px-6 ${className || ''}`}>
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
            <ExportButton onClick={handleExport} />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden h-[300px]">
        <TableComponent<HistoryTxRow>
          columns={columns}
          data={historyTxs}
          showPagination={false}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
};

export default TransactionHistorySection;