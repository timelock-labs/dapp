// components/TotalAssetValue.tsx
import React from 'react';
import { useCountUp } from '@/hooks/useCountUp';

interface TotalAssetValueProps {
	totalUsdValue: number;
}

const TotalAssetValue: React.FC<TotalAssetValueProps> = ({ totalUsdValue }) => {
	const countUpRef = useCountUp({
		end: totalUsdValue,
		duration: 2,
		decimals: 2,
		prefix: '$',
		separator: ',',
	});

	const percentageRef = useCountUp({
		end: 15.11,
		duration: 2,
		decimals: 2,
		suffix: '%',
		prefix: '+',
	});

	return (
		<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
			<h2 className='text-gray-600 text-sm font-medium mb-1'>Total asset value</h2>
			<div className='flex items-baseline space-x-2'>
				<p className='text-3xl font-bold text-gray-900'>
					<span ref={countUpRef}>$0.00</span>
				</p>
				<span className='text-green-500 text-sm font-semibold'>
					<span ref={percentageRef}>+0.00%</span>
				</span>
			</div>
		</div>
	);
};

export default TotalAssetValue;
