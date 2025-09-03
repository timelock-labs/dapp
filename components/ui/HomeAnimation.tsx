'use client';

import React from 'react';
import RiveAnimation from './RiveAnimation';
import { cn } from '@/utils/utils';

interface HomeAnimationProps {
  className?: string;
  autoplay?: boolean;
  onAnimationLoad?: () => void;
}

const HomeAnimation: React.FC<HomeAnimationProps> = ({
  className,
  autoplay = true,
  onAnimationLoad,
}) => {
  return (
    <RiveAnimation
      src="/homeAnimation.riv"
      className={cn('w-full h-full', className)}
      autoplay={autoplay}
      onLoad={onAnimationLoad}
      onLoadError={(error) => {
        console.error('Failed to load home animation:', error);
      }}
    />
  );
};

export default HomeAnimation;