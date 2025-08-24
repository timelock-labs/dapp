import React from 'react';
import type { BaseComponentProps } from '@/types';

interface LogoProps extends BaseComponentProps {
	size?: 'sm' | 'md' | 'lg';
}

/**
 * Logo component with customizable size
 *
 * @param props - Logo component props
 * @returns JSX.Element
 */
const Logo: React.FC<LogoProps> = ({ size = 'md', className }) => {
	const sizeClasses = {
		sm: 'text-[18px]',
		md: 'text-[22px]',
		lg: 'text-[26px]',
	};

	return (
		<div className={`flex items-center w-fit px-3 py-1 justify-center rounded-md bg-black ${sizeClasses[size]} ${className || ''}`}>
			<span className='logo-font text-white'>Timelocker</span>
		</div>
	);
};

export default Logo;
