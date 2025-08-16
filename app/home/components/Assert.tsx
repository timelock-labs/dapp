'use client';

import React, { useEffect, useMemo, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TotalAssetValue from './TotalAssetValue';
import PendingTransactions from './PendingTransactions';
import { useApi } from '@/hooks/useApi';
import useMoralis from '@/hooks/useMoralis';
import AssetList from './AssetList';


interface AssertProps {
	// Props interface for future extensibility
	className?: string;
	timelocks: any[]; // Assuming timelocks is an array of objects
}

const Assert: React.FC<AssertProps> = ({ timelocks }) => {
	const { request: getUerAssets } = useApi();
	const [userAssets, setUserAssets] = useState<any[]>([])

	const  moralis = useMoralis();
	const { getUserAssets } = moralis;

	useEffect(() => {
		fetchUserAssets();
	}, []);

	const fetchUserAssets = async () => {
		if (!timelocks || timelocks.length === 0) {
			console.warn('No timelocks provided');
			return;
		}
		// Assuming timelocks is an array of objects with chain_id and contract_address properties
		let assetsList = [];
		for (const timelock of timelocks) {
			try {
				const assets = await getUserAssets(timelock.chain_id, timelock.contract_address);
				console.log(`Fetched assets for timelock: ${JSON.stringify(timelock)}`, assets);
				if (assets && assets.length > 0) {
					// Process assets as needed
					assetsList.push(...assets);
				} else {
					console.warn(`No assets found for timelock: ${JSON.stringify(timelock)}`);
				}
			} catch (error) {
				console.error('Failed to fetch user assets:', error);
			}
		}
		setUserAssets(assetsList);
	}

	return (
		<PageLayout title='Home'>
			{/* 使用 PageLayout 包裹 */}
			<div className='flex flex-col space-y-6'>
				{/* Top Section: Total Asset Value */}
				<div className='w-full'>
					<TotalAssetValue totalUsdValue={2} />
				</div>

				{/* Bottom Section: Asset List and Pending Transactions */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow h-full'>
					{/* Asset List */}
					<div className='md:col-span-1 flex flex-col'>
						<AssetList assets={userAssets} />
					{/* {JSON.stringify(userAssets, null, 2)} */}
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
