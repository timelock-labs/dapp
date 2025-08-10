'use client';

import React, { useMemo } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TotalAssetValue from './TotalAssetValue';
import AssetList from './AssetList';
import PendingTransactions from './PendingTransactions';
// Import local JSON data
import ethData from '../asserts/eth.json';
import arbitrumData from '../asserts/arbitrum.json';
import sepoliaData from '../asserts/sepolia.json';

interface AssertProps {
	// Props interface for future extensibility
	className?: string;
}

const Assert: React.FC<AssertProps> = () => {
	// Combine all assets from local JSON data
	const allAssets = useMemo(() => {
		const ethAssets = ethData.data?.items || [];
		const arbitrumAssets = arbitrumData.data?.items || [];
		const sepoliaAssets = sepoliaData.data?.items || [];

		return [...ethAssets, ...arbitrumAssets, ...sepoliaAssets];
	}, []);

	// Calculate total USD value
	const totalUsdValue = useMemo(() => {
		return allAssets.reduce((total, asset) => total + (asset.quote || 0), 0);
	}, [allAssets]);

	const assetsResponse = {
		success: true,
		data: {
			assets: allAssets,
			total_usd_value: totalUsdValue,
		},
	};

	const assets = assetsResponse?.data?.assets || [];

	return (
		<PageLayout title='Home'>
			{' '}
			{/* 使用 PageLayout 包裹 */}
			<div className='flex flex-col space-y-6'>
				{/* Top Section: Total Asset Value */}
				<div className='w-full'>
					<TotalAssetValue totalUsdValue={totalUsdValue} />
				</div>

				{/* Bottom Section: Asset List and Pending Transactions */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow h-full'>
					{/* Asset List */}
					<div className='md:col-span-1 flex flex-col'>
						<AssetList assets={assets} />
					</div>

					{/* Pending Transactions */}
					<div className='md:col-span-2 flex flex-col'>
						<PendingTransactions />
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default Assert;
