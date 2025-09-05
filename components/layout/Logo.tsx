import React from 'react';
import type { BaseComponentProps } from '@/types';
import Image from "next/image"

interface LogoProps extends BaseComponentProps {
	size?: 'sm' | 'md' | 'lg';
	color?: "white" | "black"
}

/**
 * Logo component with customizable size
 *
 * @param props - Logo component props
 * @returns JSX.Element
 */
const Logo: React.FC<LogoProps> = ({ size = 'md', className, color = 'white' }) => {
	const sizeClasses = {
		sm: 'text-[18px]',
		md: 'text-[22px]',
		lg: 'text-[26px]',
	};

	let width = 180;
	let height = 36;
	switch (size) {
		case 'sm':
			width = 120;
			height = 24;
			break;
		case 'md':
			width = 180;
			height = 36;
			break;
		case 'lg':
			width = 240;
			height = 60;
			break;
		default:
			break;
	}

	return (
		<div className={`${className || ''}`}>
			{color === 'white' ? <Image src='/logo/logo-banner-white.png' alt='Logo' width={width} height={height} className={`w-[${width}px] h-[${height}px]`} /> : <Image src='/logo/logo-banner-black.png' alt='Logo' width={width} height={height} className={`w-[${width}px] h-[${height}px]`} />}
		</div>
	);
};

export default Logo;
