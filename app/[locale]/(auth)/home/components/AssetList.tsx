// components/AssetList.tsx
import React, { useState } from 'react'; // Import useState

// A helper component for the composite icon
interface CompositeCoinIconProps {
  mainColor: string; // Tailwind color class for main icon background
  mainIconText: string; // Text for the main icon (e.g., 'BNB')
  overlayColor: string; // Tailwind color class for overlay icon background
  overlayIconText: string; // Text for the overlay icon (e.g., 'E')
}

const CompositeCoinIcon: React.FC<CompositeCoinIconProps> = ({
  mainColor,
  mainIconText,
  overlayColor,
  overlayIconText,
}) => {
  return (
    <div className="relative w-9 h-9"> {/* Adjusted size to match visual */}
      {/* Main Icon */}
      <div className={`absolute inset-0 rounded-full ${mainColor} flex items-center justify-center text-white text-sm font-bold`}>
        {mainIconText}
      </div>
      {/* Overlay Icon */}
      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${overlayColor} flex items-center justify-center text-white text-xs`}>
        {overlayIconText}
      </div>
    </div>
  );
};

interface Asset {
  id: string;
  name: string;
  price: string;
  amount: string;
  value: string;
  // Now using specific props for the composite icon
  mainIconColor: string;
  mainIconText: string;
  overlayIconColor: string;
  overlayIconText: string;
}

// Increased dummy data for pagination demonstration
const dummyAssets: Asset[] = [
  { id: '1', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75', mainIconColor: 'bg-yellow-400', mainIconText: 'BNB', overlayIconColor: 'bg-blue-500', overlayIconText: 'E' },
  { id: '2', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75', mainIconColor: 'bg-yellow-400', mainIconText: 'BNB', overlayIconColor: 'bg-purple-500', overlayIconText: 'P' },
  { id: '3', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75', mainIconColor: 'bg-blue-500', mainIconText: 'ETH', overlayIconColor: 'bg-yellow-400', overlayIconText: 'B' },
  { id: '4', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75', mainIconColor: 'bg-yellow-400', mainIconText: 'BNB', overlayIconColor: 'bg-red-500', overlayIconText: 'R' },
  { id: '5', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75', mainIconColor: 'bg-orange-500', mainIconText: 'BTC', overlayIconColor: 'bg-yellow-400', overlayIconText: 'B' },
  { id: '6', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75', mainIconColor: 'bg-yellow-400', mainIconText: 'BNB', overlayIconColor: 'bg-green-500', overlayIconText: 'G' },
  { id: '7', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75', mainIconColor: 'bg-yellow-400', mainIconText: 'BNB', overlayIconColor: 'bg-pink-500', overlayIconText: 'X' },
  // Second page of data
  { id: '8', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75', mainIconColor: 'bg-red-400', mainIconText: 'DOT', overlayIconColor: 'bg-yellow-400', overlayIconText: 'Y' },
  { id: '9', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75', mainIconColor: 'bg-green-400', mainIconText: 'ADA', overlayIconColor: 'bg-blue-500', overlayIconText: 'Z' },
  { id: '10', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75', mainIconColor: 'bg-purple-400', mainIconText: 'SOL', overlayIconColor: 'bg-orange-500', overlayIconText: 'A' },
  // Third page of data (partial)
  { id: '11', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75', mainIconColor: 'bg-indigo-400', mainIconText: 'XRP', overlayIconColor: 'bg-gray-500', overlayIconText: 'B' },
  { id: '12', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75', mainIconColor: 'bg-teal-400', mainIconText: 'LTC', overlayIconColor: 'bg-red-500', overlayIconText: 'C' },
];

const AssetList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // As shown in "1-7 of 120"

  const totalItems = dummyAssets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssets = dummyAssets.slice(startIndex, endIndex);

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

  const currentRangeStart = startIndex + 1;
  const currentRangeEnd = Math.min(endIndex, totalItems);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Asset</h2>

      {/* Table Header - text-gray-500 for gray color */}
      <div className="grid grid-cols-2 text-gray-500 text-sm font-medium border-b border-gray-200 pb-3 mb-3">
        <span>Name/Price</span>
        <span className="text-right">Amount/Value</span>
      </div>

      {/* Asset List Items */}
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {currentAssets.map((asset) => ( // Use currentAssets here
          <div key={asset.id} className="grid grid-cols-2 items-center py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              <CompositeCoinIcon
                mainColor={asset.mainIconColor}
                mainIconText={asset.mainIconText}
                overlayColor={asset.overlayIconColor}
                overlayIconText={asset.overlayIconText}
              />
              <div>
                <p className="text-gray-800 font-medium text-base">{asset.name}</p>
                <p className="text-gray-500 text-sm">{asset.price}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-800 font-medium text-base">{asset.amount}</p>
              <p className="text-gray-500 text-sm">{asset.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handlePreviousPage} // Add onClick handler
          disabled={currentPage === 1} // Disable if on first page
          className={`
            flex items-center space-x-1
            bg-white border border-grey-800  text-gray-800 text-sm font-medium
            px-4 py-2 rounded-[10px]
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
            bg-white border border-grey-800  text-gray-800 text-sm font-medium
            px-4 py-2 rounded-[10px]
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

export default AssetList;