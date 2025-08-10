// components/ecosystem/EcosystemSearchHeader.tsx
import React from 'react';
import Image from 'next/image';

import bg_png from '../images/bg.png'; // Adjust the path as necessary

const EcosystemSearchHeader: React.FC = () => {
  return (
    <div
      className='bg-black text-white p-6 min-h-[60px] rounded-lg shadow-md flex items-center space-x-4'
      style={{
        backgroundImage: `url(${bg_png.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Image
        src='/ecoPanter.png'
        alt='Ecosystem Partner'
        width={20}
        height={20}
        className='text-gray-400'
      />
      <h2 className='text-xl font-semibold'>探索我们的生态伙伴</h2>
    </div>
  );
};

export default EcosystemSearchHeader;
