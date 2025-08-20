'use client';

import React, { useState, useEffect } from 'react';
import Asset from './components/Asset';
import CreateProtocol from './components/CreateProtocol';
import { useActiveWalletConnectionStatus } from 'thirdweb/react';
import { useApi } from '@/hooks/useApi';
import LoadingSkeleton from './components/LoadingSkeleton';
import { useTranslations } from 'next-intl';

export default function Home() {
	const connectionStatus = useActiveWalletConnectionStatus();
	const isConnected = connectionStatus === 'connected';
	const t = useTranslations('home_page');

	const [currentView, setCurrentView] = useState<'loading' | 'create' | 'asset'>('loading');
	const [timelockData, setTimelockData] = useState<{ total: number; compound_timelocks: Array<{ chain_id: number; contract_address: string }> } | null>(null);

	const [userProfileData, setUserProfileData] = useState<any>(null);

	const { request: getTimelockList, isLoading } = useApi();
	const { request: getUserProfile, isLoading: isLoadingUserProfile } = useApi();


	useEffect(() => {
		if (isConnected) {
			fetchTimelockData();
			fetchUserProfileData();
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

	const fetchUserProfileData = async () => {
		try {
			const { data } = await getUserProfile('/api/v1/auth/profile');
			setUserProfileData(data);
		} catch (error) {
			console.error('Failed to fetch user profile data:', error);
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

			return;
		}

		if (isLoading) {
			setCurrentView('loading');

			return;
		}

		const timer = setTimeout(() => {
			setCurrentView(hasTimelocks ? 'asset' : 'create');

		}, 200); // 短暂延迟让淡出动画完成

		return () => clearTimeout(timer);
	}, [isConnected, isLoading, hasTimelocks]);

	// 渲染当前视图
	const renderCurrentView = () => {
		switch (currentView) {
			case 'loading':
				return <LoadingSkeleton />;
			case 'asset':
				return <Asset timelocks={timelockData!.compound_timelocks} />;
			case 'create':
			default:
				return <CreateProtocol />;
		}
	};

	return <div className='min-h-screen'>{renderCurrentView()}</div>;
}
