import React from 'react';
import type { ParameterDisplayRowProps } from './types';

const ParameterDisplayRow: React.FC<ParameterDisplayRowProps> = ({ label, value, children }) => (
	<div className='flex items-center mb-2'>
		<div className='w-32 text-gray-500 text-sm font-medium'>{label}</div>
		<div className='flex-1 text-gray-900 text-sm break-all'>{value || children}</div>
	</div>
);

export default ParameterDisplayRow;
