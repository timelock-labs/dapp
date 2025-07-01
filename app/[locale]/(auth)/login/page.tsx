'use client';

import React, { useEffect } from 'react';
import Logo from '@/components/layout/Logo';
import { ConnectWallet } from '@/components/wallet/connect-wallet';
import { useAccount, useSignMessage } from 'wagmi';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

const TimeLockerSplitPage = () => {
  const { address, isConnected, chain } = useAccount();
  const { data: apiResponse, request: walletConnect, isLoading, error } = useApi();
  const { signMessageAsync } = useSignMessage();
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  useEffect(() => {
    if (isConnected && address && chain) {
      const message = 'welcome to TimeLocker!';
      signMessageAsync({ message }).then(async (signature) => {
        walletConnect('/api/v1/auth/wallet-connect', {
          method: 'POST',
          body: {
            wallet_address: address,
            signature: signature,
            message: message,
            chain_id: chain.id,
          },
        });
      });
    }
  }, [isConnected, address, chain, signMessageAsync, walletConnect]);

  useEffect(() => {
    if (apiResponse && apiResponse.success) {
      login({
        user: apiResponse.data.user,
        accessToken: apiResponse.data.access_token,
        refreshToken: apiResponse.data.refresh_token,
        expiresAt: apiResponse.data.expires_at,
      });
      router.push('/home');
    }
  }, [apiResponse, login, router]);

  useEffect(() => {
    if (error) {
      console.error('Backend connection failed:', error);
    }
  }, [error]);
  return (
    <div className="flex items-center justify-center h-screen bg-withe text-white">
      {/* Left Panel */}
      <div className="flex flex-col w-[684px] h-[852px] p-10 bg-black rounded-xl border border-gray-800 mr-4">
        {/* Header */}
        <header className="mb-10">
          <Logo />
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
      <div className="flex flex-col w-[684px] h-[852px] p-10 bg-white rounded-xl ml-4 justify-center items-center">
        <div className="bg-white rounded-lg w-[360px]">
          {/* Right Panel Header */}
          <div className="">
            <Logo />
          </div>

          <h2 className="text-black text-2xl font-semibold leading-[72px]">Get started</h2>
          <p className="text-gray-600 text-sm mb-8">
            Connect your wallet to create a new Timelock Account or import an existing one.
          </p>
          <ConnectWallet icon={false} fullWidth={true}/>
        </div>
      </div>
    </div>
  );
};

export default TimeLockerSplitPage;