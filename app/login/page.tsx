'use client';

import React, { useEffect } from 'react';
import Logo from '@/components/layout/Logo';
import LoginContent from './components/LoginContent';
import HomeAnimation from '@/app/login/components/HomeAnimation';
import './index.css';
import Image from 'next/image';

const TimeLockerSplitPage = () => {
	return (
		<div className='flex items-center justify-center h-screen min-h-[860px] min-w-[1440px] bg-black text-white'>
			<div className='flex w-[1440px] h-[860px] items-center justify-between rounded-xl border border-gray-800 relative'>
				<div className='w-full bg-black flex items-center justify-between absolute top-4 z-10 px-10'>
					<Logo />
					<div className='flex items-center gap-4'>
						<Image src='/twitter.svg' alt='Icon' width={24} height={24} className='cursor-pointer' />
						<Image src='/telegram.svg' alt='Icon' width={24} height={24} className='cursor-pointer' />
						<Image src='/book.svg' alt='Icon' width={24} height={24} className='cursor-pointer' />
						<Image src='/github.svg' alt='Icon' width={24} height={24} className='cursor-pointer' />
					</div>
				</div>

				<LoginContent />
				<div className='flex flex-col w-[860px] h-full overflow-hidden rounded-tr-xl rounded-br-xl'>
					<HomeAnimation className='w-full h-full scale-120' />
				</div>
				{/* <LoginFooter /> */}
			</div>
		</div>
	);
};

export default TimeLockerSplitPage;
