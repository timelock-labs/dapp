# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

The project uses pnpm as the package manager.

## Architecture Overview

This is a Next.js 15 React application for a timelock protocol interface with the following key architectural components:

### Core Technologies
- **Framework**: Next.js 15 with App Router and React 19
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: Zustand with persistence via localStorage
- **Web3 Integration**: Thirdweb SDK for wallet connections and blockchain interactions
- **Internationalization**: next-intl for multilingual support (English, Chinese, German)
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query for caching and state management

### Project Structure

- **`app/[locale]/`** - Internationalized routes using Next.js App Router
  - `(auth)/` - Protected routes for authenticated users
    - Various feature modules: home, create-timelock, transactions, etc.
- **`components/`** - Reusable UI components
  - `ui/` - shadcn/ui components
  - `providers/` - Context providers (Web3, Theme)
  - `auth/` - Authentication-related components
  - `layout/` - Layout and navigation components
- **`store/`** - Zustand stores for global state management
- **`hooks/`** - Custom React hooks including API interaction hooks
- **`contracts/`** - Smart contract ABIs and bytecode for timelock contracts
- **`i18n/`** - Internationalization configuration

### Key Architectural Patterns

1. **Multilingual Support**: Uses next-intl with locale-based routing (`/en/`, `/zh/`, `/de/`)
2. **Web3 Integration**: Thirdweb provider wraps the app, supports Ethereum and Sepolia testnets
3. **API Proxy**: Next.js rewrites `/api/*` requests to `http://localhost:8080/api/*`
4. **State Management**: Zustand stores with selective persistence for user preferences
5. **Component Architecture**: Uses shadcn/ui for consistent design system

### Authentication & API

- Uses JWT-based authentication with token refresh mechanism
- API requests are handled through a custom `useApi` hook that manages authorization headers
- Stores access tokens in Zustand store for persistence across sessions

### Smart Contract Integration

The app interacts with two types of timelock contracts:
- Compound Timelock
- OpenZeppelin Timelock

Contract ABIs and bytecode are stored in the `contracts/` directory for deployment and interaction.

### Development Notes

- The app supports both light and dark themes via next-themes
- All API calls are proxied through Next.js to a backend service running on port 8080
- The middleware handles internationalization routing automatically
- Uses TypeScript throughout with strict type checking