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
    sm: 'w-[100px] h-[28px] text-[18px]',
    md: 'w-[136.386px] h-[36px] text-[22px]',
    lg: 'w-[160px] h-[44px] text-[26px]'
  };

  return (
    <div className={`flex items-center rounded-lg font-righteous p-[10px] gap-[8px] bg-[#171717] ${sizeClasses[size]} ${className || ''}`}>
      <span className="leading-[100%] logo-font text-white">TimeLocker</span>
    </div>
  );
};

export default Logo;
