# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack on port 3001
- `npm run build` - Build production bundle with Turbopack
- `npm start` - Start production server on port 3001
- `npm run lint` - Run ESLint linting
- `npm run format` - Format code with Prettier and fix ESLint issues

## Architecture Overview

This is a Next.js 15 timelock protocol frontend application with the following key architectural patterns:

### Framework & Infrastructure
- **Next.js 15** with App Router and Turbopack
- **TypeScript** with strict configuration
- **Tailwind CSS** for styling with custom components
- **next-intl** for internationalization (支持中文、英文、德文)
- **Zustand** for state management with persistent storage
- **React Hook Form** with Zod validation

### State Management
- **Zustand stores**: `generalAppStore.ts` (app state), `userStore.ts` (user data)
- **Persistent state**: User preferences stored in localStorage
- **Schema validation**: Uses Zod with middleware (`zodMiddleware.ts`)

### Web3 Integration
- **thirdweb** and **viem** for blockchain interactions
- **Moralis** for blockchain data
- **ethers.js v5** for contract interactions
- Contract ABIs and bytecodes in `/contracts/`
- Custom hooks for Web3 operations in `/hooks/`

### Project Structure
- `/app/` - Next.js App Router pages and components
- `/components/` - Shared UI components following shadcn/ui patterns
- `/hooks/` - Custom React hooks organized by functionality
- `/types/` - TypeScript type definitions
- `/store/` - Zustand state management
- `/i18n/` - Internationalization configuration and translations
- `/utils/` - Utility functions

### Key Features
- **Timelock management**: Create, import, and manage timelock contracts
- **Transaction handling**: Create, execute, and cancel timelock transactions
- **ABI management**: Store and manage contract ABIs
- **Notification system**: Email and channel-based notifications
- **Multi-language support**: English, Chinese, German

### API Integration
- Backend API proxied through `/api/*` routes
- Axios for HTTP requests with custom hooks (`useApi.ts`)
- Type-safe API interfaces in `/types/api/`

### UI Components
- **shadcn/ui** component library with custom extensions
- **Radix UI** primitives for accessible components
- **Lucide React** icons
- **Sonner** for toast notifications
- Responsive design with mobile-first approach

### Safe Wallet Integration
- **Safe Apps SDK**: Multi-signature wallet support via `@safe-global/safe-apps-sdk`
- **Unified Hook**: `useSafeWallet` with built-in environment detection and enhanced features
- **Environment Detection**: Automatic detection of Safe Web, Mobile, Desktop, WalletConnect, and iframe environments
- **Safe Provider**: `SafeWalletProvider` wraps app for Safe wallet functionality
- **Safe Components**: `SafeWalletInfo`, `SafeTransactionStatus` for UI display
- **Timelock Integration**: Environment-aware Safe-specific methods for timelock operations
- **Multi-sig Support**: Handles signature collection and transaction execution with environment-specific optimizations
- **Transaction Status**: Real-time tracking of Safe transaction states

### Safe Wallet Components Location
- **Core Hook**: `hooks/useSafeWallet.ts` - Unified Safe wallet functionality with environment detection
- **Provider**: `components/wallet/SafeWalletProvider.tsx` - React Context provider
- **UI Components**: `components/wallet/SafeWallet*.tsx` - Display and status components
- **Example**: `components/examples/SafeWalletExample.tsx` - Complete integration example
- **Documentation**: `SAFE_WALLET_GUIDE.md` - Comprehensive integration guide

### Development Notes
- Uses `@/` path alias for imports
- Strict TypeScript configuration with comprehensive checks
- ESLint extends Next.js core-web-vitals and TypeScript configs
- No test framework currently configured
- Port 3001 used for both dev and production servers
- Safe Wallet requires running within Safe App environment for full functionality