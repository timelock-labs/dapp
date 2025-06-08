// components/AssetList.tsx
import React from 'react';

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

const dummyAssets: Asset[] = [
  {
    id: '1', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75',
    mainIconColor: 'bg-yellow-400', mainIconText: 'BNB',
    overlayIconColor: 'bg-blue-500', overlayIconText: 'E', // Ethereum-like overlay
  },
  {
    id: '2', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75',
    mainIconColor: 'bg-yellow-400', mainIconText: 'BNB',
    overlayIconColor: 'bg-purple-500', overlayIconText: 'P', // Placeholder for another network
  },
  {
    id: '3', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75',
    mainIconColor: 'bg-blue-500', mainIconText: 'ETH', // Ethereum-like main icon
    overlayIconColor: 'bg-yellow-400', overlayIconText: 'B', // BNB-like overlay
  },
  {
    id: '4', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75',
    mainIconColor: 'bg-yellow-400', mainIconText: 'BNB',
    overlayIconColor: 'bg-red-500', overlayIconText: 'R', // Placeholder for another network
  },
  {
    id: '5', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75',
    mainIconColor: 'bg-orange-500', mainIconText: 'BTC', // Bitcoin-like main icon
    overlayIconColor: 'bg-yellow-400', overlayIconText: 'B', // BNB-like overlay
  },
  {
    id: '6', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75',
    mainIconColor: 'bg-yellow-400', mainIconText: 'BNB',
    overlayIconColor: 'bg-green-500', overlayIconText: 'G', // Placeholder for another network
  },
   {
    id: '7', name: 'BNB', price: '$617.19', amount: '36.26', value: '$180,269.75',
    mainIconColor: 'bg-orange-500', mainIconText: 'BTC', // Bitcoin-like main icon
    overlayIconColor: 'bg-yellow-400', overlayIconText: 'B', // BNB-like overlay
  },

];

const AssetList: React.FC = () => {
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
        {dummyAssets.map((asset) => (
          <div key={asset.id} className="grid grid-cols-2 items-center py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              {/* Using the new CompositeCoinIcon component */}
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

      {/* Pagination - gray background, dark text, rounded corners */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <button className="
          flex items-center space-x-1
          bg-withe text-gray-800 text-sm font-medium border-gray-300 border
          px-4 py-2 rounded-full /* Gray background, rounded-full for pill shape */
          hover:bg-gray-300 transition-colors
        ">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Previous
        </button>
        <span className="text-sm">
          <span className="text-black font-medium">1-7</span>{' '}
          <span className="text-gray-600">of 120</span>
        </span>
        <button className="
          flex items-center space-x-1
          bg-withe text-gray-800 text-sm font-medium border-gray-300 border
          px-4 py-2 rounded-full /* Gray background, rounded-full for pill shape */
          hover:bg-gray-300 transition-colors
        ">
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default AssetList;