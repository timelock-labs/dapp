'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import Logo from '@/components/layout/Logo';
import { ConnectWallet } from '@/components/wallet/connect-wallet';
import { useActiveWalletConnectionStatus, useActiveAccount } from 'thirdweb/react';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const TimeLockerSplitPage = () => {
	const t = useTranslations('walletLogin');
	const [currentSection, setCurrentSection] = useState(0); // 0: first section, 1: second section
	const { address, signMessage } = useActiveAccount() || {};

	const connectionStatus = useActiveWalletConnectionStatus();
	const isConnected = connectionStatus === 'connected';
	const { data: apiResponse, request: walletConnect } = useApi();
	const login = useAuthStore(state => state.login);
	const router = useRouter();
	const [hasSignedIn, setHasSignedIn] = useState(false);

	const handleUserSignature = useCallback(async () => {
		if (isConnected && address && !hasSignedIn) {
			setHasSignedIn(true);
			const message = 'welcome to Timelocker!';
			try {
				const signature = await signMessage!({ message: message });
				await walletConnect('/api/v1/auth/wallet-connect', {
					wallet_address: address,
					signature: signature,
					message: message,
				});
			} catch {
				setHasSignedIn(false);
				toast.error('Error signing in');
			}
		}
	}, [isConnected, address, signMessage]);

	useEffect(() => {
		if (isConnected) {
			handleUserSignature();
		}
	}, [isConnected, handleUserSignature]);

	useEffect(() => {
		if (apiResponse && apiResponse.success) {
			login({
				user: apiResponse.data.user,
				accessToken: apiResponse.data.access_token,
				refreshToken: apiResponse.data.refresh_token,
				expiresAt: apiResponse.data.expires_at,
			});
			router.replace('/home');
		}
	}, [apiResponse, login, router]);

	const handlePrevSection = () => {
		setCurrentSection(prev => (prev === 0 ? 1 : 0));
	};

	const handleNextSection = () => {
		setCurrentSection(prev => (prev === 0 ? 1 : 0));
	};

	return (
		<div className='flex items-center justify-center h-screen bg-withe text-white'>
			<div className="flex flex-col w-[684px] h-[852px] p-10 rounded-xl border border-gray-800 mr-4 bg-[url('/logo-bg.png')] bg-cover bg-center bg-no-repeat">
				<header className='mb-10'>
					<h1 className="font-['Righteous'] font-normal text-[32px] leading-none tracking-normal text-center text-white">Timelocker</h1>
				</header>
				<main className='text-center px-8 mb-8'>
					<p className='text-4xl font-bold leading-tight logo-font'>{t('motto')}</p>
				</main>
				<footer className='flex-grow flex flex-col justify-end'>
					<div className='flex justify-between items-center mb-8'>
						<span className='text-2xl cursor-pointer hover:text-gray-400 transition-colors' onClick={handlePrevSection}>
							&larr;
						</span>
						{currentSection === 0 ?
							<h2 className='text-xl font-medium'>{t('whyTimelock')}</h2>
							: <div className='text-center'>
								<h2 className='text-xl font-medium'>{t('whyProtocol')}</h2>

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

			<div className='flex flex-col w-[684px] h-[852px] p-10 bg-white rounded-xl ml-4 justify-center items-center'>
				<div className='bg-white rounded-lg w-[360px]'>
					<Logo />
					<h2 className='text-black text-2xl font-semibold leading-[72px]'>{t('getStarted')}</h2>
					<p className='text-sm mb-8 text-black'>{t('connectWalletDescription')}</p>
					<ConnectWallet icon={false} fullWidth={true} />
				</div>
			</div>
		</div>
	);
};

export default TimeLockerSplitPage;
