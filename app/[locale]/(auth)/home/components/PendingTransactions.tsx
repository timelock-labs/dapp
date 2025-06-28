// components/PendingTransactions.tsx
import React from 'react';
import TableComponent from '@/components/ui/TableComponent'; // Import the new generic table component

interface Transaction {
  id: string;
  chain: string;
  timelock: string;
  transactions: string;
  createdAt: string;
  type: 'Pendding' | 'Witting' | 'Badge';
  endTime: string;
  chainIcon: React.ReactNode;
}

const dummyTransactions: Transaction[] = [
  { id: 't1', chain: 'Ethereum', timelock: '0x17fg...a8n9', transactions: '0x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Pendding', endTime: '3h', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
  { id: 't2', chain: 'Arbitrum', timelock: '0x17fg...a8n9', transactions: '0x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Witting', endTime: 'Table Cell Text', chainIcon: <span className="text-blue-500 text-base">🔷</span> },
  { id: 't3', chain: 'BSC', timelock: 'x17fg...a8n9', transactions: 'x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-yellow-500 text-base">🟡</span> },
  { id: 't4', chain: 'Ethereum', timelock: 'x17fg...a8n9', transactions: 'x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
  { id: 't5', chain: 'Ethereum', timelock: '0x17fg...a8n9', transactions: '0x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
  { id: 't6', chain: 'Ethereum', timelock: '0x17fg...a8n9', transactions: '0x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
  { id: 't7', chain: 'Arbitrum', timelock: '0x17fg...a8n9', transactions: '0x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Witting', endTime: 'Table Cell Text', chainIcon: <span className="text-blue-500 text-base">🔷</span> },
  { id: 't8', chain: 'BSC', timelock: 'x17fg...a8n9', transactions: 'x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-yellow-500 text-base">🟡</span> },
  { id: 't9', chain: 'Ethereum', timelock: 'x17fg...a8n9', transactions: 'x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
  { id: 't10', chain: 'Arbitrum', timelock: 'x17fg...a8n9', transactions: 'x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Witting', endTime: 'Table Cell Text', chainIcon: <span className="text-blue-500 text-base">🔷</span> },
  { id: 't11', chain: 'BSC', timelock: 'x17fg...a8n9', transactions: 'x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-yellow-500 text-base">🟡</span> },
];

const getBadgeStyle = (type: Transaction['type']) => {
  switch (type) {
    case 'Pendding': return 'bg-white text-gray-800 border border-gray-300';
    case 'Witting': return 'bg-black text-white border border-black';
    case 'Badge': return 'bg-black text-white border border-black';
    default: return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};

const PendingTransactions: React.FC = () => {
  const columns = [
    {
      key: 'chain',
      header: 'Chain',
      render: (row: Transaction) => (
        <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
          {row.chainIcon}
          <span className="text-gray-800">{row.chain}</span>
        </div>
      ),
    },
    { key: 'timelock', header: 'Timelock' },
    { key: 'transactions', header: 'Transactions' },
    { key: 'createdAt', header: 'CreateAt' },
    {
      key: 'type',
      header: 'Type',
      render: (row: Transaction) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeStyle(row.type)}`}>
          {row.type}
        </span>
      ),
    },
    { key: 'endTime', header: 'EndTime' },
  ];

  return (
    <TableComponent<Transaction> // Specify the generic type
      title="Pending Transactions"
      columns={columns}
      data={dummyTransactions}
      showPagination={true}
      itemsPerPage={7}
    />
  );
};

export default PendingTransactions;