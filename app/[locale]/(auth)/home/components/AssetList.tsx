// components/AssetList.tsx
import React, { useState } from 'react';
import Image from 'next/image';

interface Asset {
  balance: string;
  balance_wei: string;
  chain_display_name: string;
  chain_id: number;
  chain_logo_url: string;
  chain_name: string;
  contract_address: string;
  is_native: boolean;
  is_testnet: boolean;
  last_updated: string;
  price_change_24h: number;
  token_decimals: number;
  token_logo_url: string;
  token_name: string;
  token_price: number;
  token_symbol: string;
  usd_value: number;
}

interface AssetListProps {
  assets: Asset[];
}

const AssetList: React.FC<AssetListProps> = ({ assets }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // As shown in "1-7 of 120"

  const totalItems = assets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssets = assets.slice(startIndex, endIndex);

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
        {currentAssets.map((asset, index) => (
          <div key={index} className="grid grid-cols-2 items-center py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              <div className="relative w-9 h-9"> {/* Adjusted size to match visual */}
                {asset.token_logo_url && (
                  <Image
                    src={asset.token_logo_url}
                    alt={asset.token_name || 'Token'}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                )}
                {asset.chain_logo_url && (
                  <Image
                    src={asset.chain_logo_url}
                    alt={asset.chain_name || 'Chain'}
                    width={16}
                    height={16}
                    className="absolute bottom-0 right-0 rounded-full border border-white"
                  />
                )}
              </div>
              <div>
                <p className="text-gray-800 font-medium text-base">{asset.token_name || asset.chain_display_name}</p>
                <p className="text-gray-500 text-sm">${asset.token_price?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-800 font-medium text-base">{asset.balance}</p>
              <p className="text-gray-500 text-sm">${asset.usd_value?.toFixed(2) || '0.00'}</p>
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