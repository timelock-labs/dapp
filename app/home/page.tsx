'use client';

import React, { useState, useEffect } from 'react';
import Assert from './components/Assert';
import CreateProtocol from './components/CreateProtocol';
import { useActiveWalletConnectionStatus } from 'thirdweb/react';
import { useTimelockApi } from '@/hooks/useTimelockApi';

// 加载骨架屏组件
const LoadingSkeleton = () => (
	<div className='animate-pulse space-y-6 p-6'>
		<div className='h-8 bg-gray-200 rounded-md w-1/3'></div>
		<div className='space-y-3'>
			<div className='h-4 bg-gray-200 rounded w-full'></div>
			<div className='h-4 bg-gray-200 rounded w-5/6'></div>
			<div className='h-4 bg-gray-200 rounded w-4/6'></div>
		</div>
		<div className='h-32 bg-gray-200 rounded-lg'></div>
	</div>
);

// 页面内容包装器，提供淡入动画
const PageWrapper = ({ children, isVisible }: { children: React.ReactNode; isVisible: boolean }) => (
	<div className={`transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>{children}</div>
);

export default function Home() {
	const connectionStatus = useActiveWalletConnectionStatus();
	const isConnected = connectionStatus === 'connected';
	const [showContent, setShowContent] = useState(false);
	const [currentView, setCurrentView] = useState<'loading' | 'create' | 'assert'>('loading');

	const { useTimelockList } = useTimelockApi();
	const { data: timelockData, isLoading } = useTimelockList({
		status: 'active',
		enabled: isConnected, // 只有连接钱包后才请求数据
	});

	console.log(timelockData, 'timelockData');
	const hasTimelocks = !!(timelockData && timelockData.total > 0);

	// 处理页面状态变化
	useEffect(() => {
		if (!isConnected) {
			setCurrentView('create');
			setShowContent(true);
			return;
		}

		if (isLoading) {
			setCurrentView('loading');
			setShowContent(true);
			return;
		}

		// 数据加载完成后，先隐藏内容，然后切换视图，再显示
		setShowContent(false);

		const timer = setTimeout(() => {
			setCurrentView(hasTimelocks ? 'assert' : 'create');
			setShowContent(true);
		}, 200); // 短暂延迟让淡出动画完成

		return () => clearTimeout(timer);
	}, [isConnected, isLoading, hasTimelocks]);

	// 渲染当前视图
	const renderCurrentView = () => {
		switch (currentView) {
			case 'loading':
				return <LoadingSkeleton />;
			case 'assert':
				return <Assert />;
			case 'create':
			default:
				return <CreateProtocol />;
		}
	};

	return (
		<div className='min-h-screen'>
			<PageWrapper isVisible={showContent}>{renderCurrentView()}</PageWrapper>
		</div>
	);
}
