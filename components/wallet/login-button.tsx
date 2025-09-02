'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ConnectWallet } from './connect-wallet';
import { Button } from '@/components/ui/button';
import { useActiveWalletConnectionStatus, useActiveAccount, useActiveWallet, useActiveWalletChain } from 'thirdweb/react';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signWithSafe } from '@/utils/safeSignature';
import { Loader2 } from 'lucide-react';

/**
 * 登录按钮状态枚举
 */
type LoginState = 'disconnected' | 'connected' | 'signing' | 'signed';

interface LoginButtonProps {
	fullWidth?: boolean;
}

/**
 * 智能登录按钮组件，支持多种状态
 * 1. disconnected: 显示连接钱包按钮
 * 2. signing: 显示签名中状态（钱包连接后自动开始签名）
 * 3. connected: 仅在签名失败时显示重试签名按钮
 * 4. signed: 显示已完成状态（短暂显示后跳转）
 */
export function LoginButton({ fullWidth = true }: LoginButtonProps) {
	const t = useTranslations('walletLogin');
	const { address, signMessage } = useActiveAccount() || {};
	const connectionStatus = useActiveWalletConnectionStatus();
	const wallet = useActiveWallet();
	const activeChain = useActiveWalletChain();
	const isConnected = connectionStatus === 'connected';

	// Detect Safe wallet using thirdweb's detection
	const isSafeWallet = useMemo(() => {
		if (!wallet) return false;

		// Check thirdweb wallet ID
		const walletId = wallet.id;
		const isSafe = walletId === 'global.safe';
		console.log('isSafeWallet:', isSafe);
		console.log('================================');

		return isSafe;
	}, [wallet]);

	const { data: apiResponse, request: walletConnect, isLoading: apiLoading } = useApi();
	const login = useAuthStore(state => state.login);
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const router = useRouter();

	const [loginState, setLoginState] = useState<LoginState>('disconnected');
	const [signatureAttempted, setSignatureAttempted] = useState(false);

	// 根据钱包连接状态和其他条件确定当前状态
	const currentState = useMemo((): LoginState => {
		// 如果用户已经认证，显示已完成状态
		if (!isConnected) return 'disconnected';
		if (apiResponse?.success) return 'signed';
		// 优先检查 loginState，只有在真正签名中时才显示 signing
		if (loginState === 'signing' && apiLoading) return 'signing';
		// 如果 loginState 是 connected，即使 apiLoading，也要显示错误状态
		if (loginState === 'connected' || signatureAttempted) return 'connected';
		if (isAuthenticated) return 'signed';

		// 钱包已连接且未签名，显示签名中状态
		return 'signing';
	}, [isAuthenticated, isConnected, apiLoading, loginState, apiResponse?.success, signatureAttempted]);

	// 防抖处理的 ref
	const debounceRef = useRef<NodeJS.Timeout | null>(null);
	const isSigningRef = useRef(false);

	// 处理用户签名（带防抖处理）
	const handleSignature = useCallback(async () => {
		if (!isConnected || !address || !signMessage) {
			toast.error(t('pleaseConnectWallet'));
			return;
		}

		// 防抖处理：如果正在签名中，直接返回
		if (isSigningRef.current) {
			console.log('签名正在进行中，忽略重复点击');
			return;
		}

		// 清除之前的防抖定时器
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		// 设置防抖定时器
		debounceRef.current = setTimeout(async () => {
			isSigningRef.current = true;
			setLoginState('signing');
			setSignatureAttempted(true);

			try {
				await performSignature();
			} finally {
				isSigningRef.current = false;
			}
		}, 300); // 300ms 防抖延迟
	}, [isConnected, address, signMessage, t]);

	// 实际执行签名的函数
	const performSignature = useCallback(async () => {
		console.log('isSafeWallet:', isSafeWallet);

		try {
			// Step 1: Get nonce from the backend
			const nonceResponse = await walletConnect('/api/v1/auth/nonce', {
				wallet_address: address,
			});

			if (!nonceResponse?.success || !nonceResponse.data?.message || !nonceResponse.data?.nonce) {
				throw new Error('Failed to get nonce from server');
			}

			const { message, nonce } = nonceResponse.data;
			let signature: string;

			// Step 2: Sign the message
			if (isSafeWallet) {
				try {
					// 使用专门的 Safe 签名工具
					const safeSignResult = await signWithSafe({
						message,
						address: address!,
						chainId: activeChain?.id || 1
					});

					if (safeSignResult.success && safeSignResult.signature) {
						signature = safeSignResult.signature;
					} else {
						throw new Error(safeSignResult.error || 'Safe signature failed');
					}

				} catch (safeError) {
					console.error('Safe wallet authentication failed:', safeError);

					// Safe-specific error handling
					const errorMessage = safeError instanceof Error ? safeError.message : 'Unknown error';
					if (errorMessage.includes('rejected') || errorMessage.includes('denied') || errorMessage.includes('user') || errorMessage.includes('cancel')) {
						toast.error(t('safeWalletSignatureRejected') || 'Safe wallet signature was rejected by user');
					} else if (errorMessage.includes('timeout')) {
						toast.error(t('safeWalletSignatureTimeout') || 'Safe wallet signature timed out. Please check your Safe interface.');
					} else if (errorMessage.includes('not available') || errorMessage.includes('SDK')) {
						toast.error(t('safeWalletSDKError') || 'Safe wallet SDK not available. Please ensure you\'re in a Safe App environment.');
					} else if (errorMessage.includes('Strategy timeout')) {
						toast.error(t('safeWalletStrategyTimeout') || 'Safe wallet confirmation timed out. Please try again.');
					} else {
						toast.error(t('safeWalletSignatureError') || `Safe wallet authentication failed: ${errorMessage}`);
					}

					setLoginState('connected');
					return;
				}
			} else {
				if (!signMessage) {
					throw new Error('signMessage is not available');
				}
				signature = await signMessage({ message });
			}

			// Step 3: Send the signature to the backend with all required parameters
			await walletConnect('/api/v1/auth/wallet-connect', {
				wallet_address: address,
				signature: signature,
				message: message,
				nonce: nonce,
				wallet_type: isSafeWallet ? 'safe' : 'eoa',
				...(isSafeWallet && { chain_id: activeChain?.id || 1 })
			});

			setTimeout(() => {
				router.replace('/home');
			}, 1000);
		} catch (error) {
			console.error('Signature error:', error);
			setLoginState('connected');

			toast.error(t('errorSigningIn'));
		} finally {
			isSigningRef.current = false;
		}
	}, [isConnected, address, signMessage, walletConnect, t, isSafeWallet, wallet, activeChain]);

	// 处理钱包连接成功
	const handleWalletConnect = useCallback(() => {
		setLoginState('signing');
		setSignatureAttempted(false);
	}, []);

	// 处理钱包断开连接
	const handleWalletDisconnect = useCallback(() => {
		setLoginState('disconnected');
		setSignatureAttempted(false);
		// 如果用户已经认证，执行登出操作
		if (isAuthenticated) {
			const logout = useAuthStore.getState().logout;
			logout();
		}
	}, [isAuthenticated]);

	// 监听钱包连接状态，自动触发签名
	useEffect(() => {
		console.log('isConnected', isConnected);
		console.log('address', address);
		console.log('signatureAttempted', signatureAttempted);
		console.log('apiLoading', apiLoading);
		console.log('apiResponse', apiResponse);
		console.log('isAuthenticated', isAuthenticated);
		
		if (isConnected && address && !signatureAttempted && !apiLoading && !apiResponse?.success) {
			console.log('isConnected', isConnected);
			console.log('address', address);
			console.log('signatureAttempted', signatureAttempted);
			console.log('apiLoading', apiLoading);
			console.log('apiResponse', apiResponse);
			// 钱包已连接且未尝试过签名，自动开始签名
			handleSignature();
		}
	}, [isConnected, address, signatureAttempted, apiLoading, apiResponse?.success, isAuthenticated, handleSignature, router]);

	// 处理 API 响应
	useEffect(() => {
		if (apiResponse?.success) {
			setLoginState('signed');
			login({
				user: apiResponse.data.user,
				accessToken: apiResponse.data.access_token,
				refreshToken: apiResponse.data.refresh_token,
				expiresAt: apiResponse.data.expires_at,
			});
		}
	}, [apiResponse, login, router]);

	// 根据当前状态渲染不同的按钮
	const renderButton = () => {
		switch (currentState) {
			case 'disconnected':
				return (
					<ConnectWallet
						icon={false}
						fullWidth={fullWidth}
						onConnect={handleWalletConnect}
						onDisconnect={handleWalletDisconnect}
					/>
				);

			case 'connected':
				return (
					<Button
						onClick={handleSignature}
						className="w-full h-12 bg-black text-white font-medium rounded-md transition-colors"
						disabled={false}
					>
						{t('retrySignature')}
					</Button>
				);

			case 'signing':
				return (
					<Button
						disabled
						className="w-full h-12 bg-black text-white font-medium rounded-md opacity-80"
					>
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						{t('signing')}
					</Button>
				);

			case 'signed':
				return (
					<Button
						disabled
						className="w-full h-12 bg-black text-white font-medium rounded-md"
					>
						✓ {t('loginSuccess')}
					</Button>
				);

			default:
				return null;
		}
	};

	return (
		<div className="w-full">
			{renderButton()}

			{/* 状态说明文本 */}
			{currentState === 'connected' && signatureAttempted && (
				<p className="text-xs text-gray-500 mt-2 text-center">
					{t('signatureFailedRetry')}
				</p>
			)}
		</div>
	);
}
