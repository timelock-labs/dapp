'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Logo from '@/components/layout/Logo';
import { LoginButton } from '@/components/wallet/login-button';


const TimeLockerSplitPage = () => {
	const t = useTranslations('walletLogin');
	const [currentSection, setCurrentSection] = useState(0); // 0: first section, 1: second section

	const handlePrevSection = () => {
		setCurrentSection(prev => (prev === 0 ? 1 : 0));
	};

	const handleNextSection = () => {
		setCurrentSection(prev => (prev === 0 ? 1 : 0));
	};

	return (
		<div className='flex items-center justify-center h-screen min-h-[860px] min-w-[1440px] bg-black text-white'>
			<div className='flex w-[1440px] h-[860px] items-center justify-between rounded-xl border border-gray-800 relative'>
				<div className="flex flex-col w-[580px] h-full p-10  ml-4 justify-center items-center bg-[url('/bg-left-logo.svg')] bg-[size:50%_100%] bg-center bg-repeat-y">
					<div className='w-[360px] flex flex-col '>
						<h5 className='text-6xl font-medium text-center'>
							安全无捷径，
						</h5>
						<h5 className='text-6xl font-medium mb-12 mt-4'>
							时间即防线。
						</h5>
						<div className='w-[90%]'>
							<LoginButton fullWidth={true} />
						</div>
					</div>
				</div>
				<div className="flex flex-col w-[860px] h-full p-10 bg-[url('/logo-bg.svg')] bg-cover bg-center bg-no-repeat">

				</div>
				<footer className='absolute bottom-0 w-full flex justify-center items-center'>
					<div className='flex justify-around items-center mb-8 w-[80%] gap-16'>
						<span className='text-2xl cursor-pointer hover:text-gray-400 transition-colors' onClick={handlePrevSection}>
							&larr;
						</span>
						{currentSection === 0 ?
							<h2 className='text-xl font-medium'>{t('whyTimelock')}</h2>
							: <div className='text-center'>
								<h2 className='text-xl font-medium'>{t('whyProtocol')}</h2>
							</div>
						}
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
						<span className='text-2xl cursor-pointer hover:text-gray-400 transition-colors' onClick={handleNextSection}>
							&rarr;
						</span>
					</div>

				</footer>

			</div>

		</div>
	);
};

export default TimeLockerSplitPage;
