'use client';

import React, { useEffect, useMemo, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TotalAssetValue from './TotalAssetValue';
import PendingTransactions from './PendingTransactions';
import { useApi } from '@/hooks/useApi';


interface AssertProps {
	// Props interface for future extensibility
	className?: string;
}

const Assert: React.FC<AssertProps> = () => {
	const { request: getUerAssets } = useApi();
	const [userAssets, setUserAssets] = useState();

	useEffect(() => {
		fetchUserAssets();
	}, []);

	const fetchUserAssets = async () => {
		try {
			const { data } = await getUerAssets('/api/v1/assets');
			alert(data);
			setUserAssets(data);
		} catch (error) {
			console.error('Failed to fetch user assets:', error);
		}
	};

	const allAssets = useMemo(() => {
		const ethAssets = [];
		const arbitrumAssets = [];
		const sepoliaAssets = [];

		return [...ethAssets, ...arbitrumAssets, ...sepoliaAssets];
	}, []);

	// Calculate total USD value
	const totalUsdValue = useMemo(() => {
		return allAssets.reduce((total, asset) => total + (asset.quote || 0), 0);
	}, [allAssets]);

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
						{/* <AssetList assets={userAssets} /> */}
						{userAssets}
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
