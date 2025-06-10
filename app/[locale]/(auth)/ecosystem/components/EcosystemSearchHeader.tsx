// components/ecosystem/EcosystemSearchHeader.tsx
import React from 'react';

const EcosystemSearchHeader: React.FC = () => {
  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-md flex items-center space-x-4">
      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
      </svg>
      <h2 className="text-xl font-semibold">探索我们的生态伙伴</h2>
    </div>
  );
};

export default EcosystemSearchHeader;