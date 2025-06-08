// components/PendingTransactions.tsx
import React, { useState } from 'react'; // Import useState

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

// Increased dummy data for pagination demonstration
const dummyTransactions: Transaction[] = [
  { id: 't1', chain: 'Ethereum', timelock: '0x17fg...a8n9', transactions: '0x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Pendding', endTime: '3h', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
  { id: 't2', chain: 'Arbitrum', timelock: '0x17fg...a8n9', transactions: '0x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Witting', endTime: 'Table Cell Text', chainIcon: <span className="text-blue-500 text-base">🔷</span> },
  { id: 't3', chain: 'BSC', timelock: 'x17fg...a8n9', transactions: '0x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-yellow-500 text-base">🟡</span> },
  { id: 't4', chain: 'Ethereum', timelock: 'x17fg...a8n9', transactions: '0x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
  { id: 't5', chain: 'Ethereum', timelock: '0x17fg...a8n9', transactions: '0x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
  { id: 't6', chain: 'Ethereum', timelock: '0x17fg...a8n9', transactions: '0x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
  { id: 't7', chain: 'Arbitrum', timelock: '0x17fg...a8n9', transactions: '0x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Witting', endTime: 'Table Cell Text', chainIcon: <span className="text-blue-500 text-base">🔷</span> },
  // Second page of data
  { id: 't8', chain: 'BSC', timelock: 'x17fg...a8n9', transactions: 'x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-yellow-500 text-base">🟡</span> },
  { id: 't9', chain: 'Ethereum', timelock: 'x17fg...a8n9', transactions: 'x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
  { id: 't10', chain: 'Arbitrum', timelock: 'x17fg...a8n9', transactions: 'x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Witting', endTime: 'Table Cell Text', chainIcon: <span className="text-blue-500 text-base">🔷</span> },
  { id: 't11', chain: 'BSC', timelock: 'x17fg...a8n9', transactions: 'x17fg...a8n9', createdAt: 'May 24,2025...', type: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-yellow-500 text-base">🟡</span> },
];

const PendingTransactions: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // As shown in "1-7 of 120"

  const totalItems = dummyTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = dummyTransactions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getBadgeStyle = (type: Transaction['type']) => {
    switch (type) {
      case 'Pendding':
        return 'bg-white text-gray-800 border border-gray-300';
      case 'Witting':
      case 'Badge':
        return 'bg-black text-white border border-black';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const currentRangeStart = startIndex + 1;
  const currentRangeEnd = Math.min(endIndex, totalItems);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Pending Transactions</h2>

      <div className="flex-grow overflow-x-auto overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chain</th>
              <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timelock</th>
              <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
              <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CreateAt</th>
              <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EndTime</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentTransactions.map((tx) => ( // Use currentTransactions here
              <tr key={tx.id}>
                <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                    {tx.chainIcon}
                    <span className="text-gray-800">{tx.chain}</span>
                  </div>
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{tx.timelock}</td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{tx.transactions}</td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{tx.createdAt}</td>
                <td className="px-2 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeStyle(tx.type)}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{tx.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - same style as AssetList.tsx */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handlePreviousPage} // Add onClick handler
          disabled={currentPage === 1} // Disable if on first page
          className={`
            flex items-center space-x-1
            bg-gray-200 text-gray-800 text-sm font-medium
            px-4 py-2 rounded-full
            hover:bg-gray-300 transition-colors
            ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} /* Dim and prevent clicks when disabled */
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Previous
        </button>
        {/* Dynamic pagination text */}
        <span className="text-sm">
          <span className="text-black font-medium">{currentRangeStart}-{currentRangeEnd}</span>{' '}
          <span className="text-gray-600">of {totalItems}</span>
        </span>
        <button
          onClick={handleNextPage} // Add onClick handler
          disabled={currentPage === totalPages} // Disable if on last page
          className={`
            flex items-center space-x-1
            bg-gray-200 text-gray-800 text-sm font-medium
            px-4 py-2 rounded-full
            hover:bg-gray-300 transition-colors
            ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''} /* Dim and prevent clicks when disabled */
          `}
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default PendingTransactions;