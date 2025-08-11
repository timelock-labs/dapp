import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppStateSchema, type AppState, type User, type TimelockContractItem } from './schema';
import { zodMiddleware } from './zodMiddleware';
import axios from 'axios';

// 定义 Store 的 actions (方法)
type AppActions = {
	login: (data: { user: User; accessToken: string; refreshToken: string; expiresAt: string }) => void;
	logout: () => void;
	fetchChains: () => Promise<void>;
	refreshAccessToken: () => Promise<void>;
	// 模拟一个错误的 action
	loginWithInvalidData: () => void;
	setAllTimelocks: (timelocks: TimelockContractItem[]) => void;
};

// 创建 store，并包裹 zodMiddleware
export const useAuthStore = create<AppState & AppActions>()(
	persist(
		zodMiddleware<AppState, AppActions>(
			// 第一个参数是我们的 Zod schema
			AppStateSchema,
			// 第二个参数是标准的 zustand creator
			(set, get) => ({
				user: null,
				isAuthenticated: false,
				accessToken:
					document.cookie
						.split('; ')
						.find(row => row.startsWith('accessToken='))
						?.split('=')[1] || null,
				refreshToken:
					document.cookie
						.split('; ')
						.find(row => row.startsWith('refreshToken='))
						?.split('=')[1] || null,
				expiresAt: null, // 初始化为 null，稍后会从 cookie 中获取
				// 初始化状态
				chains: [],
				allTimelocks: [],
				_hasHydrated: false,

				login: data => {
					// 写入到 cookie
					document.cookie = `accessToken=${data.accessToken}; path=/`;
					document.cookie = `refreshToken=${data.refreshToken}; path=/`;
					document.cookie = `expiresAt=${data.expiresAt}; path=/`;
					// The persist middleware will automatically save the state.
					set({
						user: data.user,
						isAuthenticated: true,
						accessToken: data.accessToken,
						refreshToken: data.refreshToken,
						expiresAt: new Date(data.expiresAt).getTime(),
					});
				},
				logout: () => {
					// 从 cookie 中删除
					document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
					document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
					document.cookie = 'expiresAt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
					// The persist middleware will automatically clear the persisted state.
					set({
						user: null,
						isAuthenticated: false,
						accessToken: null,
						refreshToken: null,
						expiresAt: null,
						allTimelocks: [],
					});
				},
				fetchChains: async () => {
					try {
						const response = await axios.post('/api/v1/chain/list');
						if (response.data.success) {
							if (response.data.data && Array.isArray(response.data.data.chains)) {
								set({ chains: response.data.data.chains });
							} else {
								set({ chains: [] }); // Ensure chains is always an array
							}
						} else {
							set({ chains: [] }); // Ensure chains is always an array on error
						}
					} catch (error) {
						set({ chains: [] }); // Ensure chains is always an array on error
					}
				},
				refreshAccessToken: async () => {
					const state = get();
					if (!state.refreshToken) {
						console.warn('No refresh token available.');
						return;
					}

					try {
						const response = await fetch('/api/v1/auth/refresh', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								refresh_token: state.refreshToken,
							}),
						});

						if (response.ok) {
							const data = await response.json();
							// Persist middleware will automatically save the updated tokens.
							set({
								accessToken: data.data.access_token,
								refreshToken: data.data.refresh_token,
								expiresAt: new Date(data.data.expires_at).getTime(),
							});
							console.log('Access token refreshed successfully.');
						} else {
							console.error('Failed to refresh access token:', response.statusText);
							// Optionally, log out the user if refresh fails
							get().logout();
						}
					} catch (error) {
						console.error('Error refreshing access token:', error);
						get().logout();
					}
				},
				loginWithInvalidData: () => {
					// This action deliberately sets data that does not conform to the schema
					set({ user: { id: '123', name: 'x', email: 'bad-email' } });
				},
				setAllTimelocks: timelocks => set({ allTimelocks: timelocks }),
			})
		),
		{
			name: 'auth-storage', // 使用唯一的键名以避免冲突
			storage: createJSONStorage(() => localStorage), // 按要求使用 localStorage
			// partialize 是必须的，它告诉 middleware 只持久化数据状态，而不是 action (方法)
			partialize: state => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				expiresAt: state.expiresAt,
				chains: state.chains,
				allTimelocks: state.allTimelocks,
			}),
			// onRehydrateStorage 会在从 storage 恢复状态后执行
			onRehydrateStorage: () => state => {
				if (state) {
					state.isAuthenticated = !!state.accessToken; // 确保认证状态在加载时是正确的
					state._hasHydrated = true; // 设置水合状态为 true
				}
			},
		}
	)
);
