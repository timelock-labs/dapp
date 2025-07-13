import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppStateSchema, type AppState, type User, type TimelockContract } from './schema';
import { zodMiddleware } from './zodMiddleware';

// 定义 Store 的 actions (方法)
type AppActions = {
  login: (data: { user: User; accessToken: string; refreshToken: string; expiresAt: string }) => void;
  logout: () => void;
  fetchChains: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  // 模拟一个错误的 action
  loginWithInvalidData: () => void;
  setAllTimelocks: (timelocks: TimelockContract[]) => void;
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
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        chains: [],
        allTimelocks: [],
        _hasHydrated: false,
        login: (data) => {
          // The persist middleware will automatically save the state.
          // No need for manual storage management.
          set({
            user: data.user,
            isAuthenticated: true,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresAt: new Date(data.expiresAt).getTime(),
          });
        },
        logout: () => {
          // The persist middleware will automatically clear the persisted state.
          set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null, expiresAt: null, allTimelocks: [] });
        },
        fetchChains: async () => {
          try {
            console.log('Fetching chains...');
            const response = await fetch('/api/v1/chain/list');
            console.log('Chains API response status:', response.status);
            if (response.ok) {
              const responseData = await response.json();
              console.log('Chains API response data:', responseData);
              if (responseData.data && Array.isArray(responseData.data.chains)) {
                console.log('Setting chains:', responseData.data.chains);
                set({ chains: responseData.data.chains });
              } else {
                console.error('API returned non-array data for chains:', responseData);
                set({ chains: [] }); // Ensure chains is always an array
              }
            } else {
              console.error('Failed to fetch chains', response.statusText);
              set({ chains: [] }); // Ensure chains is always an array on error
            }
          } catch (error) {
            console.error('Error fetching chains:', error);
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
        setAllTimelocks: (timelocks) => set({ allTimelocks: timelocks }),
      })
    ),
    {
      name: 'auth-storage', // 使用唯一的键名以避免冲突
      storage: createJSONStorage(() => localStorage), // 按要求使用 localStorage
      // partialize 是必须的，它告诉 middleware 只持久化数据状态，而不是 action (方法)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        chains: state.chains,
        allTimelocks: state.allTimelocks,
      }),
      // onRehydrateStorage 会在从 storage 恢复状态后执行
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.accessToken; // 确保认证状态在加载时是正确的
          state._hasHydrated = true; // 设置水合状态为 true
        }
      },
    }
  )
);