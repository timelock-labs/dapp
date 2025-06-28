"use client"
import React, { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import SearchBar from '@/components/ui/SearchBar';
import ExportButton from '@/components/ui/ExportButton';
import TabbedNavigation from './TabbedNavigation';
import TableComponent from '@/components/ui/TableComponent';

// Define Transaction type specific to this table
interface HistoryTxRow {
  id: string;
  chain: string;
  tagRemark: string; // 标签备注
  timelockAddress: string;
  txHash: string; // 交易hash
  type: string; // 类型 (e.g., '已执行', '已失效', '已取消', '待处理')
  chainIcon: React.ReactNode; // For chain icon
}

const dummyHistoryTxs: HistoryTxRow[] = [
  { id: 'h1', chain: 'BNB', tagRemark: 'Pancake Swap', timelockAddress: '0x0a8h...2da1', txHash: '0xa98...a9h1', type: '已执行', chainIcon: <span className="text-yellow-500 text-base">🪙</span> },
  { id: 'h2', chain: 'BNB', tagRemark: 'Pancake Swap', timelockAddress: '0x0a8h...2da1', txHash: '0xa98...a9h1', type: '已失效', chainIcon: <span className="text-yellow-500 text-base">🪙</span> },
  { id: 'h3', chain: 'BNB', tagRemark: 'Pancake Swap', timelockAddress: '0x0a8h...2da1', txHash: '0xa98...a9h1', type: '已取消', chainIcon: <span className="text-yellow-500 text-base">🪙</span> },
  { id: 'h4', chain: 'BNB', tagRemark: 'Pancake Swap', timelockAddress: '0x0a8h...2da1', txHash: '0xa98...a9h1', type: '待处理', chainIcon: <span className="text-yellow-500 text-base">🪙</span> },
  // Add more dummy data for pagination/tabs
];

const getHistoryTxTypeStyle = (type: string) => {
  switch (type) {
    case '已执行': return 'bg-green-100 text-green-800';
    case '已失效': return 'bg-red-100 text-red-800';
    case '已取消': return 'bg-gray-100 text-gray-800';
    case '待处理': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const TransactionHistorySection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'executed', etc.

  const historyTabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: '待处理' },
    { id: 'executed', label: '已执行' },
    { id: 'invalid', label: '已失效' },
    { id: 'cancelled', label: '已取消' },
  ];

  // Filter data based on activeTab (basic filtering for demo)
  const filteredHistoryTxs = dummyHistoryTxs.filter(tx => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending' && tx.type === '待处理') return true;
    if (activeTab === 'executed' && tx.type === '已执行') return true;
    if (activeTab === 'invalid' && tx.type === '已失效') return true;
    if (activeTab === 'cancelled' && tx.type === '已取消') return true;
    return false;
  });

  const columns = [
    {
      key: 'chain',
      header: '所在链',
      render: (row: HistoryTxRow) => (
        <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
          {row.chainIcon}
          <span className="text-gray-800">{row.chain}</span>
        </div>
      ),
    },
    { key: 'tagRemark', header: '标签备注' },
    { key: 'timelockAddress', header: 'Timelock 地址' },
    { key: 'txHash', header: '交易hash' },
    {
      key: 'type',
      header: '类型',
      render: (row: HistoryTxRow) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getHistoryTxTypeStyle(row.type)}`}>
          {row.type}
        </span>
      ),
    },
    // No '操作' column in history table per image
  ];

  const handleExport = () => console.log('Export clicked!');

  return (
    // Root div: h-400px, flex-col, horizontal padding px-6, no vertical padding.
    <div className="bg-white border border-gray-200 flex flex-col h-[400px] px-6">
      
      {/* Top Section: SectionHeader, Tabs, Search/Export. Combined Height: 152px. */}
      {/* This section uses flex-col and justify-between to space out its two main rows. */}
      {/* Internal vertical padding (e.g., pt-6 pb-4) applied here to manage spacing within the 152px. */}
      <div className="h-[152px] flex flex-col justify-between pt-6 pb-4">
        {/* Row 1: SectionHeader */}
        <div>
          <SectionHeader
            title="历史交易"
            description="Read and write directly to databases and stores from your projects."
          />
        </div>

        {/* Row 2: TabbedNavigation and Search/Export Bar */}
        <div className="flex justify-between items-center">
          <div> {/* Tabs on the left */}
            <TabbedNavigation tabs={historyTabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="flex items-center space-x-3"> {/* Search and Export on the right */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search" />
            <ExportButton onClick={handleExport} />
          </div>
        </div>
      </div>

      {/* Table Section - takes up the remaining height. */}
      <div className="flex-1 overflow-hidden h-[300px]"> 
        <TableComponent<HistoryTxRow>
          columns={columns}
          data={filteredHistoryTxs} // Use filtered data
          showPagination={false} 
        />
      </div>
    </div>
  );
};

export default TransactionHistorySection;