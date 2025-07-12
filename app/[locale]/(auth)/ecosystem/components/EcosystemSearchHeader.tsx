// components/ecosystem/EcosystemSearchHeader.tsx
import React from 'react';
import Image from 'next/image';

const EcosystemSearchHeader: React.FC = () => {
  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-md flex items-center space-x-4 pb-[112px]">
      <Image 
        src="/ecoPanter.png" 
        alt="Ecosystem Partner" 
        width={20} 
        height={20} 
        className="text-gray-400"
      />
      <h2 className="text-xl font-semibold">探索我们的生态伙伴</h2>
    </div>
  );
};

export default EcosystemSearchHeader;