'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import Logo from '@/components/layout/Logo';
import { ConnectWallet } from '@/components/wallet/connect-wallet';
import { useActiveWalletConnectionStatus, useActiveAccount } from 'thirdweb/react';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

const TimeLockerSplitPage = () => {
	const t = useTranslations('walletLogin');
	const [currentSection, setCurrentSection] = useState(0); // 0: first section, 1: second section
	const { address, signMessage } = useActiveAccount() || {};

	const connectionStatus = useActiveWalletConnectionStatus();
	const isConnected = connectionStatus === 'connected';
	const { data: apiResponse, request: walletConnect, error } = useApi();
	const login = useAuthStore(state => state.login);
	const router = useRouter();

	const handleUserSignature = useCallback(async () => {
		if (isConnected && address) {
			const message = 'welcome to TimeLocker!';
			try {
				const signature = await signMessage!({ message: message });
				await walletConnect('/api/v1/auth/wallet-connect', {
					wallet_address: address,
					signature: signature,
					message: message,
				});
			} catch (error) {
				console.error('Error signing message:', error);
			}
		}
	}, [isConnected, address]);

	useEffect(() => {
		handleUserSignature();
	}, [isConnected, address]);

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

	const handlePrevSection = () => {
		setCurrentSection(prev => (prev === 0 ? 1 : 0));
	};

	const handleNextSection = () => {
		setCurrentSection(prev => (prev === 0 ? 1 : 0));
	};

	return (
		<div className='flex items-center justify-center h-screen bg-withe text-white'>
			{/* Left Panel */}
			<div className="flex flex-col w-[684px] h-[852px] p-10 rounded-xl border border-gray-800 mr-4 bg-[url('/logo-bg.png')] bg-cover bg-center bg-no-repeat">
				{/* Header */}
				<header className='mb-10'>
					<h1 className="font-['Righteous'] font-normal text-[32px] leading-none tracking-normal text-center text-white">TimeLocker</h1>
				</header>

				{/* Main Motto Section */}
				<main className='text-center px-8 mb-8'>
					<p className='text-4xl font-bold leading-tight logo-font'>{t('motto')}</p>
				</main>

				{/* Footer / Why use Timelock section */}
				<footer className='flex-grow flex flex-col justify-end'>
					<div className='flex justify-between items-center mb-8'>
						<span className='text-2xl cursor-pointer hover:text-gray-400 transition-colors' onClick={handlePrevSection}>
							&larr;
						</span>
						{currentSection === 0 ?
							<h2 className='text-xl font-medium'>{t('whyTimelock')}</h2>
							: <div className='text-center'>
								<h2 className='text-xl font-medium'>{t('whyProtocol')}</h2>
								{/* <p className='text-sm text-gray-300 mt-1'>{t('protocolSubtitle')}</p> */}
							</div>
						}
						<span className='text-2xl cursor-pointer hover:text-gray-400 transition-colors' onClick={handleNextSection}>
							&rarr;
						</span>
					</div>
					<div className='grid grid-cols-2 gap-4'>
						{currentSection === 0 ?
							<>
								<div className='bg-neutral-900 hover:bg-neutral-800 transition-colors p-6 rounded-lg text-center flex items-center justify-center h-[36px] text-black-300 text-xs '>
									{t('features.preventUnauthorized')}
								</div>
								<div className='bg-neutral-900 hover:bg-neutral-800 transition-colors p-6 rounded-lg text-center flex items-center justify-center h-[36px] text-black-300 text-xs'>
									{t('features.avoidRisks')}
								</div>
								<div className='bg-neutral-900 hover:bg-neutral-800 transition-colors p-6 rounded-lg text-center flex items-center justify-center h-[36px] text-black-300 text-xs'>
									{t('features.earlyWarning')}
								</div>
								<div className='bg-neutral-900 hover:bg-neutral-800 transition-colors p-6 rounded-lg text-center flex items-center justify-center h-[36px] text-black-300 text-xs'>
									{t('features.industryStandard')}
								</div>
							</>
							: <>
								<div className='bg-neutral-900 hover:bg-neutral-800 transition-colors p-6 rounded-lg text-center flex items-center justify-center h-[36px] text-black-300 text-xs '>
									{t('protocolFeatures.importExisting')}
								</div>
								<div className='bg-neutral-900 hover:bg-neutral-800 transition-colors p-6 rounded-lg text-center flex items-center justify-center h-[36px] text-black-300 text-xs'>
									{t('protocolFeatures.readableEncoding')}
								</div>
								<div className='bg-neutral-900 hover:bg-neutral-800 transition-colors p-6 rounded-lg text-center flex items-center justify-center h-[36px] text-black-300 text-xs'>
									{t('protocolFeatures.eventManagement')}
								</div>
								<div className='bg-neutral-900 hover:bg-neutral-800 transition-colors p-6 rounded-lg text-center flex items-center justify-center h-[36px] text-black-300 text-xs'>
									{t('protocolFeatures.comprehensiveMonitoring')}
								</div>
							</>
						}
					</div>
				</footer>
			</div>

			{/* Right Panel */}
			<div className='flex flex-col w-[684px] h-[852px] p-10 bg-white rounded-xl ml-4 justify-center items-center'>
				<div className='bg-white rounded-lg w-[360px]'>
					{/* Right Panel Header */}
					<div className=''>
						<Logo />
					</div>

					<h2 className='text-black text-2xl font-semibold leading-[72px]'>{t('getStarted')}</h2>
					<p className='text-gray-600 text-sm mb-8'>{t('connectWalletDescription')}</p>
					<ConnectWallet icon={false} fullWidth={true} />
				</div>
			</div>
		</div>
	);
};

export default TimeLockerSplitPage;
