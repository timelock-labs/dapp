'use client';

import React, { useEffect } from 'react';
import { useRive } from '@rive-app/react-canvas';
import { cn } from '@/utils/utils';

interface HomeAnimationProps {
	className?: string;
	autoplay?: boolean;
	onAnimationLoad?: () => void;
}

const HomeAnimation: React.FC<HomeAnimationProps> = ({ className, autoplay = true, onAnimationLoad }) => {
	const { RiveComponent, rive } = useRive({
		src: '/homeAnimation.riv',
		autoplay: false, // 禁用自动播放，通过鼠标事件控制
		onLoad: () => {
			onAnimationLoad?.();
		},
		onLoadError: () => {
			console.error('Failed to load home animation');
		},
	});

	// 处理autoplay逻辑
	useEffect(() => {
		if (rive && autoplay) {
			rive.play();
		}
	}, [rive, autoplay]);

	const handleMouseEnter = () => {
		if (rive) {
			rive.reset(); // 重置动画到开始状态
			rive.play(); // 播放动画
		}
	};

	const handleMouseLeave = () => {
		if (rive) {
			if (autoplay) {
				rive.play(); // 如果autoplay为true，继续播放
			} else {
				rive.pause(); // 否则暂停
			}
		}
	};

	return (
		<div className={cn('w-full h-full cursor-pointer', className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			<RiveComponent className='w-full h-full' />
		</div>
	);
};

export default HomeAnimation;
