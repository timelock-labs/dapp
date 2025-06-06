'use client'; // 标记为客户端组件

import React from 'react';
import Logo from '@/public/logo.png';
import { ConnectWallet } from '@/components/wallet/connect-wallet';
import { Web3Provider } from "@/components/providers/web3-provider";

const TimeLockerSplitPage = () => {
  return (
    <div className="flex min-h-screen bg-withe text-white p-6">
      {/* Left Panel */}
      <div className="flex flex-col w-1/2 p-10 bg-black rounded-lg border border-gray-800 mr-4">
        {/* Header */}
        <header className="mb-10">
          <img src={Logo.src} alt="Logo" className=" " />
        </header>

        {/* Main Motto Section */}
        <main className="flex-grow flex items-center justify-center text-center px-8">
          <p className="text-4xl font-bold leading-tight">安全无捷径，时间即防线</p>
        </main>

        {/* Footer / Why use Timelock section */}
        <footer className="mt-auto pt-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-medium">为什么要使用 Timelock ?</h2>
            <div className="flex space-x-4 text-2xl cursor-pointer">
              <span className="hover:text-gray-400 transition-colors">&larr;</span>
              <span className="hover:text-gray-400 transition-colors">&rarr;</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900 hover:bg-neutral-800 transition-colors p-6 rounded-lg text-center flex items-center justify-center h-[36px] text-black-300 text-xs ">
              防止未经授权的即时执行交易
            </div>
            <div className="bg-neutral-900 hover:bg-neutral-800 transition-colors p-6 rounded-lg text-center flex items-center justify-center h-[36px] text-black-300 text-xs">
              避免操作不当带来的安全风险
            </div>
            <div className="bg-neutral-900 hover:bg-neutral-800 transition-colors p-6 rounded-lg text-center flex items-center justify-center h-[36px] text-black-300 text-xs">
              给社区和用户预警时间
            </div>
            <div className="bg-neutral-900 hover:bg-neutral-800 transition-colors p-6 rounded-lg text-center flex items-center justify-center h-[36px] text-black-300 text-xs">
              头部协议都在用其来管理资金和权限
            </div>
          </div>
        </footer>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col w-1/2 p-10 bg-white rounded-lg ml-4 justify-center items-center">
        <div className="bg-white p-8 rounded-lg  max-w-sm w-full">
          {/* Right Panel Header */}
          <div className="">
            <img src={Logo.src} alt="Logo" className=" " />
          </div>

          <h2 className="text-black text-2xl font-semibold mb-4">Get started</h2>
          <p className="text-gray-600 text-sm mb-8">
            Connect your wallet to create a new Timelock Account or import an existing one.
          </p>
          <Web3Provider >
            <ConnectWallet icon={false}/>

          </Web3Provider>
        </div>
      </div>
    </div>
  );
};

export default TimeLockerSplitPage;