'use client';

import { createThirdwebClient } from 'thirdweb';
import { ConnectButton } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';
import { memo } from 'react';
import { useAuthStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { BaseComponentProps, VoidCallback } from '@/types';

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || '....',
});

const wallets = [
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('com.okex.wallet'),
  createWallet('global.safe'),
  createWallet('com.safepal'),
];

interface ConnectWalletProps extends BaseComponentProps {
  icon?: boolean;
  fullWidth?: boolean;
  headerStyle?: boolean;
  onConnect?: VoidCallback;
  onDisconnect?: VoidCallback;
}

// 样式常量，便于维护和自定义
const WALLET_STYLES = {
  button: {
    base: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.375rem',
      fontWeight: '500',
      transition: 'background-color 0.2s ease',
      cursor: 'pointer',
    },
    hover: {
      backgroundColor: '#374151',
    },
    fullWidth: {
      height: '48px',
      width: '100%',
    },
    header: {
      height: '36px',
      width: '115px',
    },
  },
  connected: {
    hideFirstChild: { display: 'none' },
    hideLastSpan: { display: 'none' },
    centerText: { textAlign: 'center' as const },
  },
} as const;

/**
 * Connect wallet component with thirdweb integration
 *
 * @param props - ConnectWallet component props
 * @returns JSX.Element
 */
export const ConnectWallet = memo(function ConnectWallet({
  fullWidth,
  headerStyle,
  onConnect,
  onDisconnect,
  className,
}: ConnectWalletProps) {
  const logout = useAuthStore(state => state.logout);
  const router = useRouter();

  const wrapperClass = cn('connect-wallet-container', fullWidth ? 'w-full' : 'w-auto', className);

  return (
    <div className={wrapperClass}>
      <ConnectButton
        client={client}
        connectModal={{
          size: 'compact',
          ...(headerStyle && { title: '连接钱包' }),
        }}
        wallets={wallets}
        theme='dark'
        onConnect={() => {
          console.log('Wallet connected');
          onConnect?.();
        }}
        onDisconnect={() => {
          console.log('Wallet disconnected');
          logout();
          router.push('/login');
          onDisconnect?.();
        }}
      />
      <style jsx global>{`
        /* 连接按钮基础样式 */
        .connect-wallet-container [data-testid='connect-button'],
        .connect-wallet-container button[data-theme] {
          background-color: ${WALLET_STYLES.button.base.backgroundColor} !important;
          color: ${WALLET_STYLES.button.base.color} !important;
          border: ${WALLET_STYLES.button.base.border} !important;
          border-radius: ${WALLET_STYLES.button.base.borderRadius} !important;
          font-weight: ${WALLET_STYLES.button.base.fontWeight} !important;
          transition: ${WALLET_STYLES.button.base.transition} !important;
          cursor: ${WALLET_STYLES.button.base.cursor} !important;
          ${fullWidth
            ? `height: ${WALLET_STYLES.button.fullWidth.height} !important; width: ${WALLET_STYLES.button.fullWidth.width} !important;`
            : `height: ${WALLET_STYLES.button.header.height} !important; width: ${WALLET_STYLES.button.header.width} !important;`}
        }

        /* 悬停效果 */
        .connect-wallet-container [data-testid='connect-button']:hover,
        .connect-wallet-container button[data-theme]:hover {
          background-color: ${WALLET_STYLES.button.hover.backgroundColor} !important;
        }

        /* 已连接按钮样式 - 根据实际DOM结构 */
        .connect-wallet-container .tw-connected-wallet {
          background-color: ${WALLET_STYLES.button.base.backgroundColor} !important;
          color: ${WALLET_STYLES.button.base.color} !important;
          border: ${WALLET_STYLES.button.base.border} !important;
          border-radius: ${WALLET_STYLES.button.base.borderRadius} !important;
          font-weight: ${WALLET_STYLES.button.base.fontWeight} !important;
          transition: ${WALLET_STYLES.button.base.transition} !important;
          cursor: ${WALLET_STYLES.button.base.cursor} !important;
          ${fullWidth
            ? `height: ${WALLET_STYLES.button.fullWidth.height} !important; width: ${WALLET_STYLES.button.fullWidth.width} !important;`
            : `height: ${WALLET_STYLES.button.header.height} !important; width: ${WALLET_STYLES.button.header.width} !important; min-width: ${WALLET_STYLES.button.header.width} !important; max-width: ${WALLET_STYLES.button.header.width} !important;`}
          box-sizing: border-box !important;
        }

        /* 已连接按钮悬停效果 */
        .connect-wallet-container .tw-connected-wallet:hover {
          background-color: ${WALLET_STYLES.button.hover.backgroundColor} !important;
        }

        /* 隐藏头像 */
        .connect-wallet-container .tw-connected-wallet > div:first-child {
          display: none !important;
        }

        /* 隐藏余额信息 */
        .connect-wallet-container .tw-connected-wallet .tw-connected-wallet__balance {
          display: none !important;
        }

        /* 地址容器居中 */
        .connect-wallet-container .tw-connected-wallet > div:last-child {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
        }

        /* 地址文本居中 */
        .connect-wallet-container .tw-connected-wallet__address {
          text-align: center !important;
          width: 100% !important;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
        }

        .connect-wallet-container .tw-connected-wallet__address span {
          display: block !important;
          text-align: center !important;
          width: 100% !important;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
        }
      `}</style>
    </div>
  );
});
