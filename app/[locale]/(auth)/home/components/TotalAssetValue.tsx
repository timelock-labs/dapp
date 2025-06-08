// components/TotalAssetValue.tsx
import React from 'react';

const TotalAssetValue: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-gray-600 text-sm font-medium mb-1">Total asset value</h2>
      <div className="flex items-baseline space-x-2">
        <p className="text-3xl font-bold text-gray-900">$40,199.05</p>
        <span className="text-green-500 text-sm font-semibold">+15.11%</span>
      </div>
    </div>
  );
};

export default TotalAssetValue;