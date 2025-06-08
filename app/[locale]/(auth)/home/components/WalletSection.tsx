'use client';

import React, { useState } from 'react';
import { Inbox } from 'lucide-react';


const WalletSection: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('BNB Smart Chain'); // Default selection

  const networks: string[] = ['Ethereum', 'Arbitrum One', 'BNB Smart Chain'];

  return (
    <div className="bg-white p-12 rounded-lg  flex flex-col items-center justify-center relative border border-gray-200 border-dashed">
      <div className="flex flex-col items-center justify-center p-4">
        {/* Icon container with dotted border */}
        <div className="
        w-24 h-24 /* This seems to be the size of the overall icon container from the image */
        border-2 border-gray-200
        flex items-center justify-center    rounded-lg 
        mb-2 /* Space between icon and label */
        relative /* For positioning the icon inside if needed, though not strictly required for a simple SVG */
      ">
          {/* Placeholder SVG resembling an inbox/box icon */}

          <Inbox
            className="w-12 h-12 /* Visual size of the icon inside the 24x24 box */
          text-black
          stroke-current stroke-2"
            fill="none"
            viewBox="0 0 24 24" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M4 12c-1.105 0-2 .895-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4c0-1.105-.895-2-2-2zM4 12V6a2 2 0 012-2h12a2 2 0 012 2v6"></path>

        </div>


      </div>
      <p className="text-xl font-semibold text-gray-800 mb-2 mt-8">你还没有 Timelock 钱包</p>
      <p className="text-gray-600 text-sm mb-6">Read and write directly to databases and stores from your projects.</p>
      <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
        Create new
      </button>
    </div>
  );
};

export default WalletSection;