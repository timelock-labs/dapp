# Gemini Workspace

## Project Overview

This is a Next.js project bootstrapped with `create-next-app`. It appears to be a Web3 application based on the included dependencies.

### Key Technologies

*   **Framework:** [Next.js](https://nextjs.org/)
*   **UI:** [shadcn/ui](https://ui.shadcn.com/)
*   **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
*   **Web3:** [Wagmi](https://wagmi.sh/), [RainbowKit](https://www.rainbowkit.com/), [ConnectKit](https://docs.connectkit.family/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Linting:** [ESLint](https://eslint.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)

### Project Structure

*   `app/[locale]/`: This directory contains the main application logic, with subdirectories for different features like `auth`, `home`, `timelocks`, etc. The `[locale]` directory suggests that the application supports multiple languages.
*   `components/`: This directory contains reusable UI components.
*   `i18n/`: This directory likely contains the configuration for `next-intl`.
*   `messages/`: This directory contains the translation files for different languages.
*   `public/`: This directory contains static assets like images and icons.
*   `services/`: This directory may contain services for interacting with external APIs or other parts of the application.

### Getting Started

To run the development server, use one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## API and State Management

This project centralizes API requests and authentication state management using custom hooks and Zustand stores.

### `useApi` Hook for Backend Requests

All backend requests should utilize the `useApi` hook located in `hooks/useApi.ts`. This hook provides a consistent way to make API calls, handling loading states, errors, and responses. It returns an object containing `data`, `request` (the function to trigger the API call), `isLoading`, and `error`.

**Usage Example (from `app/[locale]/(auth)/login/page.tsx`):**

```typescript
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';

// ... inside your component

const { data: apiResponse, request: walletConnect, isLoading, error } = useApi();
const login = useAuthStore((state) => state.login);

useEffect(() => {
  // Example of making an API call using the 'request' function from useApi
  if (isConnected && address && chain) {
    const message = 'welcome to TimeLocker!';
    signMessageAsync({ message }).then(async (signature) => {
      walletConnect('/api/v1/auth/wallet-connect', {
        method: 'POST',
        body: {
          wallet_address: address,
          signature: signature,
          message: message,
          chain_id: chain.id,
        },
      });
    });
  }
}, [isConnected, address, chain, signMessageAsync, walletConnect]);

useEffect(() => {
  // Example of handling API response and updating global state
  if (apiResponse && apiResponse.success) {
    login({
      user: apiResponse.data.user,
      accessToken: apiResponse.data.access_token,
      refreshToken: apiResponse.data.refresh_token,
      expiresAt: apiResponse.data.expires_at,
    });
    router.push('/home');
  }
}, [apiResponse, login, router]);

useEffect(() => {
  // Example of handling API errors
  if (error) {
    console.error('Backend connection failed:', error);
  }
}, [error]);
```

### `useAuthStore` for Authentication State

The `useAuthStore` (defined in `store/userStore.ts`) is a Zustand store responsible for managing the application's authentication state, including `accessToken`, `refreshToken`, user information, and authentication status. It also handles the persistence of tokens in cookies.

**Key features:**
*   **`login(data)`:** Sets user, access token, refresh token, and expiry, and persists tokens in cookies.
*   **`logout()`:** Clears authentication state and removes tokens from cookies.
*   **`refreshAccessToken()`:** Handles refreshing the access token using the refresh token.

**Usage Example (from `app/[locale]/(auth)/login/page.tsx`):**

```typescript
import { useAuthStore } from '@/store/userStore';

// ... inside your component

const login = useAuthStore((state) => state.login);

// Call login after successful authentication API response
useEffect(() => {
  if (apiResponse && apiResponse.success) {
    login({
      user: apiResponse.data.user,
      accessToken: apiResponse.data.access_token,
      refreshToken: apiResponse.data.refresh_token,
      expiresAt: apiResponse.data.expires_at,
    });
    // ... redirect or other actions
  }
}, [apiResponse, login]);
```

By following these patterns, we ensure a consistent and maintainable approach to API interactions and authentication state across the application.
