'use client';

import React, { useState, useEffect } from 'react';
import Assert from './components/Asset';
import CreateProtocol from './components/CreateProtocol';
import { useActiveWalletConnectionStatus } from 'thirdweb/react';
import { useApi } from '@/hooks/useApi';
import LoadingSkeleton from './components/LoadingSkeleton';

// 页面内容包装器，提供淡入动画
const PageWrapper = ({ children, isVisible }: { children: React.ReactNode; isVisible: boolean }) => (
	<div className={`transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>{children}</div>
);

export default function Home() {
	const connectionStatus = useActiveWalletConnectionStatus();
	const isConnected = connectionStatus === 'connected';
	const [showContent, setShowContent] = useState(false);
	const [currentView, setCurrentView] = useState<'loading' | 'create' | 'assert'>('loading');
	const [timelockData, setTimelockData] = useState<{ total: number; compound_timelocks: Array<{ chain_id: number; contract_address: string }> } | null>(null);

	const { request: getTimelockList, isLoading } = useApi();

	useEffect(() => {
		if (isConnected) {
			fetchTimelockData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isConnected]);

	const fetchTimelockData = async () => {
		try {
			const { data } = await getTimelockList('/api/v1/timelock/list', { page: 1, page_size: 10 });
			setTimelockData(data);
		} catch (error) {
			console.error('Failed to fetch timelock data:', error);
		}
	};

	const hasTimelocks = !!(timelockData && timelockData.total > 0);


	useEffect(() => {
		// getUserToken()
	}, []);

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
				return <Assert timelocks={timelockData!.compound_timelocks} />;
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
