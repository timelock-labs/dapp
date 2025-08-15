import React from 'react';
import type { ParameterDisplayRowProps } from '../types/types';

const ParameterDisplayRow: React.FC<ParameterDisplayRowProps> = ({ label, value, children }) => (
	<div className='mb-4'>
		<div className='text-sm font-medium text-gray-700 mb-1'>{label}</div>
		<div className='inline-flex h-10 bg-gray-100 text-gray-900 px-3 py-2 rounded-md text-sm font-mono font-bold items-center gap-2 max-w-full'>
			<span className='truncate'>{value || children}</span>
		</div>
	</div>
);

export default ParameterDisplayRow;
