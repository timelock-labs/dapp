// components/AssetList.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import AnimatedAssetValue from './AnimatedAssetValue';
import { ethers } from 'ethers';
import { useTranslations } from 'next-intl';

export interface Asset {
	token_address: string;
	name: string;
	symbol: string;
	logo: string;
	thumbnail: string;
	decimals: number;
	balance: string;
	possible_spam: boolean;
	verified_contract: boolean;
	usd_price: number;
	usd_price_24hr_percent_change: number;
	usd_price_24hr_usd_change: number;
	usd_value_24hr_usd_change: number;
	usd_value: number;
	portfolio_percentage: number;
	balance_formatted: string;
	native_token: boolean;
	total_supply: number | null;
	total_supply_formatted: string | null;
	percentage_relative_to_total_supply: number | null;
}

interface AssetListProps {
	assets: Asset[];
}

const AssetList: React.FC<AssetListProps> = ({ assets }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Changed from 7 to 10
	const t = useTranslations('common');
	const totalItems = assets.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentAssets = assets.slice(startIndex, endIndex);

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const currentRangeStart = startIndex + 1;
	const currentRangeEnd = Math.min(endIndex, totalItems);

	return (
		<div className='bg-white p-6 rounded-lg border border-gray-200 flex flex-col h-full'>
			<h2 className='text-lg font-semibold text-gray-800 mb-4'>Asset</h2>

			{/* Table Header - text-gray-500 for gray color */}
			<div
				className='grid grid-cols-2 text-gray-500 
      rounded-lg
      text-sm font-medium border-b border-gray-200 bg-gray-50 p-3'>
				<span>Name/Price</span>
				<span className='text-right'>Amount/Value</span>
			</div>

			{/* Asset List Items */}
			<div className='flex-grow overflow-y-auto pr-2 custom-scrollbar'>
				{currentAssets.length > 0 && currentAssets.map((asset, index) => (
					<div key={index} className='flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0'>
						<div className='flex items-center gap-3 text-sm'>
							<Image src={asset.logo} alt={asset.name || asset.symbol || 'Token'} width={24} height={24} className='rounded-full' />
							<div className='col'>
								<div className='flex gap-1 items-center'>
									<span>{asset.symbol}</span>
									<span className='text-gray-500 text-xs'>{asset.name}</span>
									</div>
								<div>${asset.usd_price ? asset.usd_price : '0.00'}</div>
							</div>
						</div>
						<div>
							<span className='text-gray-500 text-sm'>
								{ethers.utils.formatUnits(asset.balance.toString(), asset.decimals)}
							</span>
						</div>
					</div>
				))}
			</div>

			{/* Pagination */}
			<div className='flex justify-between items-center mt-6 pt-4 border-t border-gray-200'>
				<button
					type='button'
					onClick={handlePreviousPage} // Add onClick handler
					disabled={currentPage === 1} // Disable if on first page
					className={`
            flex items-center space-x-1
            bg-white border border-grey-800  text-gray-800 text-sm font-medium
            px-4 py-2 rounded-[10px]
            hover:bg-gray-300 transition-colors
            ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} /* Dim and prevent clicks when disabled */
          `}>
					<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 19l-7-7m0 0l7-7m-7 7h18'></path>
					</svg>
					{t('previous')}
				</button>
				{/* Dynamic pagination text */}
				<span className='text-sm'>
					<span className='text-black font-medium'>
						<AnimatedAssetValue value={currentRangeStart} decimals={0} fallback='1' />
						-
						<AnimatedAssetValue value={currentRangeEnd} decimals={0} fallback='1' />
					</span>{' '}
					<span className='text-gray-600'>
						of <AnimatedAssetValue value={totalItems} decimals={0} fallback='0' />
					</span>
				</span>
				<button
					type='button'
					onClick={handleNextPage} // Add onClick handler
					disabled={currentPage === totalPages} // Disable if on last page
					className={`
            flex items-center space-x-1
            bg-white border border-grey-800  text-gray-800 text-sm font-medium
            px-4 py-2 rounded-[10px]
            hover:bg-gray-300 transition-colors
            ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''} /* Dim and prevent clicks when disabled */
          `}>
					{t('next')}
					<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default AssetList;
