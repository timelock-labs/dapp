import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppStateSchema, type AppState, type User, type Chain } from './schema';
import { zodMiddleware } from './zodMiddleware';
import Cookies from 'js-cookie';

// 定义 Store 的 actions (方法)
type AppActions = {
  login: (data: { user: User; accessToken: string; refreshToken: string; expiresAt: string }) => void;
  logout: () => void;
  fetchChains: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  // 模拟一个错误的 action
  loginWithInvalidData: () => void;
};

// 创建 store，并包裹 zodMiddleware
export const useAuthStore = create<AppState & AppActions>()(
  persist(
    zodMiddleware(
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
        _hasHydrated: false,
        login: (data) => {
          // Here we handle the business logic, validation is handled by the middleware
          set({ user: data.user, isAuthenticated: true, accessToken: data.accessToken, refreshToken: data.refreshToken, expiresAt: data.expiresAt });
          Cookies.set('accessToken', data.accessToken, { expires: new Date(data.expiresAt) });
          // Assuming refresh token has a longer expiry, e.g., 30 days
          Cookies.set('refreshToken', data.refreshToken, { expires: 30 });
        },
        logout: () => {
          set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null, expiresAt: null });
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
        },
        fetchChains: async () => {
          try {
            const response = await fetch('/api/v1/chain/list');
            if (response.ok) {
              const { data } = await response.json();
              if (Array.isArray(data.chains)) {
                set({ chains: data.chains });
              } else {
                console.error('API returned non-array data for chains:', data);
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
              set({
                accessToken: data.data.access_token,
                refreshToken: data.data.refresh_token,
                expiresAt: data.data.expires_at,
              });
              Cookies.set('accessToken', data.data.access_token, { expires: new Date(data.data.expires_at) });
              Cookies.set('refreshToken', data.data.refresh_token, { expires: 30 }); // Assuming refresh token has a longer expiry
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
          // @ts-expect-error - Deliberately setting invalid data for demonstration
          set({ user: { id: '123', name: 'x', email: 'bad-email' } });
        },
      })
    ),
    {
      name: 'app-storage', // name of the item in storage (e.g. localStorage key)
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const item = Cookies.get(name);
          return item ? item : null;
        },
        setItem: (name, value) => {
          Cookies.set(name, value);
        },
        removeItem: (name) => {
          Cookies.remove(name);
        },
      })),
      onRehydrateStorage: (state) => {
        console.log('hydration starts', state)
        return (state) => {
          state._hasHydrated = true
        }
      }
    }
  )
);