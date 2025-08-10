// components/email-address/PermissionCheckbox.tsx
import React from 'react';

interface PermissionCheckboxProps {
	id: string;
	label: string; // e.g., "Timelock1 (备注名称)"
	subLabel: string; // e.g., "0x6d5ad...6714"
	icon: React.ReactNode; // e.g., an SVG or image for the chain icon
	checked: boolean;
	onChange: (id: string, checked: boolean) => void;
}

const PermissionCheckbox: React.FC<PermissionCheckboxProps> = ({
	id,
	label,
	subLabel,
	icon,
	checked,
	onChange,
}) => {
	return (
		<label htmlFor={id} className='flex items-start cursor-pointer py-2'>
			<input
				type='checkbox'
				id={id}
				checked={checked}
				onChange={e => onChange(id, e.target.checked)}
				className='form-checkbox h-[16px] w-[16px] accent-black border-gray-300 rounded focus:ring-black-500 mt-1 mr-3 rounded-lg'
			/>
			<div className='flex-grow'>
				<p className='text-gray-900 font-medium text-sm'>{label}</p>
				<p className='text-gray-500 text-xs'>{subLabel}</p>
			</div>
			<div className='ml-4 flex-shrink-0'>{icon}</div>
		</label>
	);
};

export default PermissionCheckbox;
