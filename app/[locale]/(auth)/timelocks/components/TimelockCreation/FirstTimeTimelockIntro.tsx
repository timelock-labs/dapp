// components/timelock-creation/FirstTimeTimelockIntro.tsx
import React from 'react';

const FirstTimeTimelockIntro: React.FC = () => {
  return (
    <div className="bg-black text-white p-8 rounded-lg shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-3">
        {/* Angle bracket icon */}
        <svg className="w-6 h-6 text-white-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <div>
          <h2 className="text-xl font-semibold mb-1">第一次使用 Timelock Protocol ?</h2>
          <p className="text-sm opacity-80">Timelock Protocol 提供了全套的基于 Timelock 机制的工具，用户可以在平台上创建一个...</p>
        </div>
      </div>
      <button className="bg-white text-black px-6 py-2 rounded-md font-medium hover: transition-colors flex items-center space-x-2">
        <span>Learn more</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
        </svg>
      </button>
    </div>
  );
};

export default FirstTimeTimelockIntro;