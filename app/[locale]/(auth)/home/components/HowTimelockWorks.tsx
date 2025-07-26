import React from 'react';

const HowTimelockWorks: React.FC = () => {
  return (
    // Initial state: white background, light border, gray text
    // Hover state (group-hover): black background, white text, blue border (or transparent/dark)
    <div className=" p-8 rounded-xl  border border-gray-200 group hover:bg-black hover:shadow-lg hover:border-black transition-all duration-300 cursor-pointer">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center group-hover:text-white transition-colors duration-300">
        <span className="text-black mr-2 group-hover:text-white transition-colors duration-300">&gt;</span> Timelock 是如何运行的?
      </h3>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
        Timelock 是一种智能合约安全机制，同时也是一种钱包，用于在区块链中延迟执行特定操作。它通过设置一个“解锁时间”，在该时间之前，操作无法被执行。这种机制...
      </p>
      <a
        href="https://timelock.gitbook.io/timelock/"
        className="inline-flex items-center justify-center bg-white text-black py-2 px-4 rounded-md text-sm font-semibold border border-gray-300 hover: /* Add shadow on hover for the button itself */ focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
      >
        Read more{' '}
        <svg
          className="ml-2 w-4 h-4 transform transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
        </svg>
      </a>
    </div>
  );
};

export default HowTimelockWorks;