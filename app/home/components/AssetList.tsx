'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AnimatedAssetValue from './AnimatedAssetValue';
import { ethers } from 'ethers';
import { useTranslations } from 'next-intl';
import ChainLabel from '@/components/web3/ChainLabel';
import { TimelockContractItem } from '@/types';
import TableComponent from '@/components/ui/TableComponent';

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
	const tAssetList = useTranslations('assetList');
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

	const columns = [
		{
			key: 'chain',
			header: tAssetList('chain'),
			render: (row: Asset) => <ChainLabel chainId={row.chain_id} />,
		},
		{
			key: 'name',
			header: tAssetList('namePrice'),
			render: (asset: Asset) => {
				return <div className='flex items-center gap-3 text-sm'>
					<Image src={asset.logo} alt={asset.name || asset.symbol || 'Token'} width={24} height={24} className='rounded-full' />
					<div className='col'>
						<div className='flex gap-1 items-center'>
							<span>{asset.symbol}</span>
							<span className='  text-xs'>{asset.name}</span>
						</div>
						<div>${asset.usd_price ? asset.usd_price : '0.00'}</div>
					</div>
				</div>
			}
		},
		{
			key: 'balance',
			header: tAssetList('amountValue'),
			render: (asset: Asset) => {
				return <div>
					{ethers.utils.formatUnits(asset.balance.toString(), asset.decimals)}
				</div>
			}
		}
	];

	return (
		<div className='bg-white p-6  rounded-lg border border-gray-200 flex flex-col h-full'>

			<TableComponent<any> columns={columns} data={currentAssets} showPagination={true} itemsPerPage={5} />

		</div>
	);
};

export default AssetList;
