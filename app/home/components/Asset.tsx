'use client';

import React, { useEffect, useState } from 'react';
import TotalAssetValue from './TotalAssetValue';
import PendingTransactions from './PendingTransactions';
import { useApi } from '@/hooks/useApi';
import useMoralis from '@/hooks/useMoralis';
import AssetList from './AssetList';
import { CalendarOff, ClipboardCheck, Hourglass, Podcast, RefreshCwOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AssertProps {
	// Props interface for future extensibility
	className?: string;
	timelocks: any[]; // Assuming timelocks is an array of objects
}

const Assert: React.FC<AssertProps> = ({ timelocks }) => {
	const t = useTranslations('home_page');
	const [userAssets, setUserAssets] = useState<any[]>([]);
	const [totalUSD, setTotalUSD] = useState(0);
	const { request: getFlowsCountReq } = useApi();

	const [flow_count, setFlowCount] = useState({
		waiting: 0,
		ready: 0,
		executed: 0,
		cancelled: 0,
		expired: 0,
	});

	useEffect(() => {
		fetchFlowsCount();
	}, []);

	const fetchFlowsCount = async () => {
		const { data } = await getFlowsCountReq('/api/v1/flows/list/count');
		setFlowCount(data.flow_count);
	};

	const moralis = useMoralis();
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
		const usdValue = assetsList.reduce((total, asset) => total + asset.usd_value, 0);
		setTotalUSD(usdValue);
	};

	return (

		<div className='flex flex-col space-y-6'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow h-[120px]'>
				<div className='md:col-span-1 flex flex-col'>
					<TotalAssetValue totalUsdValue={totalUSD} />
				</div>
				<div className='md:col-span-2 flex flex-col'>
					<div className='flex justify-around gap-6 border border-gray-200 rounded-lg h-full'>
						<div className='flex flex-col space-y-4 bg-white rounded-lg'>
							<div className='flex flex-col items-left gap-1 relative overflow-hidden p-6'>
								<div className='absolute right-[-20px] bottom-[-20px]  '>
									<Hourglass width={60} height={60} color='rgba(0,0,0,.05)' />
								</div>
								<div className='text-xs font-medium text-gray-500'>{t('waitingTransaction')}</div>
								<div className='text-5xl font-bold'>{flow_count.waiting}</div>
							</div>
						</div>

						<div className='flex flex-col space-y-4 bg-white rounded-lg'>
							<div className='flex flex-col items-left gap-1 relative overflow-hidden p-6'>
								<div className='absolute right-[-20px] bottom-[-20px]  '>
									<Podcast width={60} height={60} color='rgba(0,0,0,.05)' />
								</div>
								<div className='text-xs font-medium text-gray-500'>{t('readyTransaction')}</div>
								<div className='text-5xl font-bold'>{flow_count.ready}</div>
							</div>
						</div>
						<div className='flex flex-col space-y-4 bg-white rounded-lg'>
							<div className='flex flex-col items-left gap-1 relative overflow-hidden p-6'>
								<div className='absolute right-[-20px] bottom-[-20px]  '>
									<ClipboardCheck width={60} height={60} color='rgba(0,0,0,.05)' />
								</div>
								<div className='text-xs font-medium text-gray-500'>{t('executedTransaction')}</div>
								<div className='text-5xl font-bold'>{flow_count.executed}</div>
							</div>
						</div>

						<div className='flex flex-col space-y-4 bg-white rounded-lg'>
							<div className='flex flex-col items-left gap-1 relative overflow-hidden p-6'>
								<div className='absolute right-[-20px] bottom-[-20px]  '>
									<RefreshCwOff width={60} height={60} color='rgba(0,0,0,.05)' />
								</div>
								<div className='text-xs font-medium text-gray-500'>{t('cancelledTransaction')}</div>
								<div className='text-5xl font-bold'>{flow_count.cancelled}</div>
							</div>
						</div>

						<div className='flex flex-col space-y-4 bg-white rounded-lg'>
							<div className='flex flex-col items-left gap-1 relative overflow-hidden p-6'>
								<div className='absolute right-[-20px] bottom-[-20px]  '>
									<CalendarOff width={60} height={60} color='rgba(0,0,0,.05)' />
								</div>
								<div className='text-xs font-medium text-gray-500'>{t('expiredTransaction')}</div>
								<div className='text-5xl font-bold'>{flow_count.expired}</div>
							</div>
						</div>
					</div>
				</div>

			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow h-full'>
				<div className='md:col-span-1 flex flex-col'>
					<AssetList assets={userAssets} />
				</div>

				<div className='md:col-span-2 flex flex-col'>
					<PendingTransactions />
				</div>
			</div>
		</div>
	);
};

export default Assert;
