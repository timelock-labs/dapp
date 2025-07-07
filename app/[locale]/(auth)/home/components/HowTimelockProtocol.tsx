import React from 'react';

const HowTimelockWorks: React.FC = () => {
  return (
    // Initial state: white background, light border, gray text
    // Hover state (group-hover): black background, white text, blue border (or transparent/dark)
    <div className="bg-[#F5F5F5] p-8 rounded-xl shadow-md border border-gray-200 group hover:bg-black hover:shadow-lg hover:border-black transition-all duration-300 cursor-pointer">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center group-hover:text-white transition-colors duration-300">
        <span className="text-black mr-2 group-hover:text-white transition-colors duration-300">&gt;</span> 如何使用 Timelock Protocol？
      </h3>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
        Timelock Protocol 提供了全套的基于 Timelock 机制的工具，用户可以在平台上创建一个 Timelock 合约或者导入符合标准的已有 Timelock 合约，即可在平台上实现
      </p>
      <a
        href="#"
        className="inline-flex items-center justify-center bg-white text-black py-2 px-4 rounded-md text-sm font-semibold border border-gray-300 hover:shadow-md /* Add shadow on hover for the button itself */ focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
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