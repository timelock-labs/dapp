"use client"
import React, { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import SearchBar from '@/components/ui/SearchBar';
import FilterButton from '@/components/ui/FilterButton';
import NewButton from '@/components/ui/NewButton';
import TableComponent from '@/components/ui/TableComponent'; // Reusing generic table

// Define Transaction type specific to this table
interface PendingTxRow {
  id: string;
  chain: string;
  tagRemark: string; // 标签备注
  timelockAddress: string;
  txHash: string; // 交易hash
  type: string; // 类型 (e.g., '倒计时3h', '待执行')
  operations: React.ReactNode; // 操作列 (ellipsis menu)
  chainIcon: React.ReactNode; // For chain icon
}

const dummyPendingTxs: PendingTxRow[] = [
  { id: 'p1', chain: 'BNB', tagRemark: 'Pancake Swap', timelockAddress: '0x0a8h...2da1', txHash: '0xa98...a9h1', type: '倒计时3h', operations: <span className="text-gray-500">...</span>, chainIcon: <span className="text-yellow-500 text-base">🪙</span> },
  { id: 'p2', chain: 'BNB', tagRemark: 'Pancake Swap', timelockAddress: '0x0a8h...2da1', txHash: '0xa98...a9h1', type: '待执行', operations: <span className="text-gray-500">...</span>, chainIcon: <span className="text-yellow-500 text-base">🪙</span> },
  // Add more dummy data as needed for pagination
];

const getPendingTxTypeStyle = (type: string) => {
  switch (type) {
    case '倒计时3h': return 'bg-gray-100 text-gray-800'; // Default light gray
    case '待执行': return 'bg-black text-white'; // Black background for '待执行'
    default: return 'bg-gray-100 text-gray-800';
  }
};


const PendingTransactionsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    {
      key: 'chain',
      header: '所在链',
      render: (row: PendingTxRow) => (
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
      render: (row: PendingTxRow) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPendingTxTypeStyle(row.type)}`}>
          {row.type}
        </span>
      ),
    },
    {
      key: 'operations',
      header: '操作',
      render: (row: PendingTxRow) => (
        <button onClick={() => console.log('Operations for:', row.id)} className="text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors">
          {row.operations}
        </button>
      ),
    },
  ];

  const handleFilter = () => console.log('Filter clicked!');
  const handleNew = () => console.log('New clicked!');

  return (
    // Set the overall height of this section to 400px and make it a flex column
    // This allows child elements to use flex-grow or flex-1 to fill available space.
    <div className="bg-white p-6 border border-gray-200 flex flex-col h-[400px] pt-0 pb-0">
      {/* Header Row: SectionHeader and Search/Filter Bar - fixed height of 100px */}
      <div className="flex justify-between items-center h-[100px] mb-4 p-0"> {/* mb-4 for spacing below this row */}
        <div> {/* Wrapper for SectionHeader */}
          <SectionHeader
            title="待处理"
            description="Read and write directly to databases and stores from your projects."
          />
        </div>
        <div className="flex items-center space-x-3"> {/* Wrapper for SearchBar and Buttons */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search" />
          <FilterButton onClick={handleFilter} />
          <NewButton onClick={handleNew} />
        </div>
      </div>
      {/* Table Section - takes up the remaining height (300px - mb-4) */}
      <div className="flex-1 overflow-hidden"> {/* flex-1 allows this div to grow and fill remaining space, overflow-hidden clips content */}
        <TableComponent<PendingTxRow>
          columns={columns}
          data={dummyPendingTxs}
          showPagination={false} // Image does not show pagination for this table
        />
      </div>
    </div>
  );
};

export default PendingTransactionsSection;