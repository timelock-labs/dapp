# Safe Wallet 集成指南

## 概述

本文档提供了 TimeLocker 项目中 Safe Wallet 集成的完整指南，包括架构设计、使用方法和最佳实践。

## 快速开始

### 1. 安装依赖

```bash
npm install @safe-global/safe-apps-sdk
```

### 2. 基本使用

```tsx
// 使用统一的 Safe Wallet Hook
import { useSafeWallet } from '@/hooks/useSafeWallet';

export function MyComponent() {
  const { 
    isSafeApp, 
    safeInfo, 
    environmentInfo,
    createTimelockTransaction 
  } = useSafeWallet();

  if (!isSafeApp) {
    return <div>请在 Safe App 中使用此功能</div>;
  }

  const handleCreateTransaction = async () => {
    await createTimelockTransaction(
      '0x...', // timelock 地址
      '0x...', // 目标地址
      '1000000000000000000', // 1 ETH in wei
      '0x', // 数据
      Date.now() + 86400 // 24小时后执行
    );
  };

  return (
    <div>
      <p>Safe 地址: {safeInfo?.safeAddress}</p>
      <p>环境: {environmentInfo?.type}</p>
      <button onClick={handleCreateTransaction}>
        创建 Timelock 交易
      </button>
    </div>
  );
}
```

### 3. Provider 集成

```tsx
// app/layout.tsx
import { SafeWalletProvider } from '@/components/wallet/SafeWalletProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SafeWalletProvider>
          {children}
        </SafeWalletProvider>
      </body>
    </html>
  );
}
```

## 架构设计

### 核心组件

1. **useSafeWallet Hook** (`hooks/useSafeWallet.ts`)
   - 统一的 Safe Wallet 集成入口
   - 包含环境检测、交易处理、Timelock 操作
   - 支持多种 Safe 环境类型

2. **SafeWalletProvider** (`components/wallet/SafeWalletProvider.tsx`)
   - React Context 提供者
   - 全局状态管理

3. **UI 组件**
   - `SafeWalletInfo` - 显示 Safe 信息
   - `SafeTransactionStatus` - 交易状态跟踪

### 环境检测

系统支持自动检测以下 Safe 环境：

- `SAFE_WEB_APP` - Safe 网页版 (app.safe.global)
- `SAFE_MOBILE_APP` - Safe 移动端应用
- `SAFE_DESKTOP_APP` - Safe 桌面端应用
- `SAFE_WALLET_CONNECT` - WalletConnect 连接
- `SAFE_IFRAME_EMBEDDED` - iframe 嵌入环境
- `NOT_SAFE` - 非 Safe 环境

## API 参考

### useSafeWallet Hook

#### 返回值

```typescript
interface UseSafeWalletReturn {
  // 基础状态
  safeInfo: SafeInfo | null;
  isLoading: boolean;
  error: string | null;
  
  // 环境信息
  environmentInfo: SafeEnvironmentInfo | null;
  environmentConfig: EnvironmentConfig | null;
  isSafeApp: boolean;
  isSafeWebApp: boolean;
  isSafeMobileApp: boolean;
  isSafeDesktopApp: boolean;
  isSafeWalletConnect: boolean;
  isSafeIframeEmbedded: boolean;
  isInIframe: boolean;
  isMobile: boolean;
  supportsWalletConnect: boolean;
  
  // 基本操作
  getSafeContract: (provider: Provider) => Contract;
  isOwner: (address: string, provider: Provider) => Promise<boolean>;
  getSafeBalances: () => Promise<Balance[]>;
  verifySafeSignature: (message: string, signature: string, provider: Provider) => Promise<boolean>;
  
  // 交易操作
  sendSafeTransaction: (transactions: SafeTransactionData[]) => Promise<SafeTxResult>;
  sendBatchTransaction: (transactions: SafeTransactionData[]) => Promise<SafeTxResult>;
  
  // Timelock 操作
  createTimelockTransaction: (timelockAddress: string, targetAddress: string, value: string, data: string, eta: number) => Promise<SafeTxResult>;
  executeTimelockTransaction: (timelockAddress: string, targetAddress: string, value: string, data: string, eta: number) => Promise<SafeTxResult>;
  cancelTimelockTransaction: (timelockAddress: string, txHash: string) => Promise<SafeTxResult>;
  
  // 工具方法
  initializeSafeSDK: () => Promise<void>;
  redetect: () => void;
}
```

### 核心接口

```typescript
export interface SafeInfo {
  safeAddress: string;
  chainId: number;
  owners: string[];
  threshold: number;
  isReadOnly: boolean;
  network: string;
}

export interface SafeTransactionData {
  to: string;
  value: string;
  data: string;
  operation?: number;
}

export interface SafeTxResult {
  safeTxHash: string;
  safeAddress: string;
  threshold: number;
  environmentType?: SafeEnvironmentType;
}

export interface SafeEnvironmentInfo {
  type: SafeEnvironmentType;
  userAgent: string;
  isIframe: boolean;
  origin: string;
  parentOrigin: string | null;
  supportsWalletConnect: boolean;
  isMobile: boolean;
  browserInfo: {
    name: string;
    version: string;
    platform: string;
  };
}
```

## 使用示例

### 1. 检测 Safe 环境

```tsx
const { environmentInfo, isSafeApp, isSafeMobileApp } = useSafeWallet();

if (isSafeMobileApp) {
  // 移动端特定逻辑
  console.log('在 Safe 移动端应用中运行');
} else if (isSafeApp) {
  // 其他 Safe 环境
  console.log('在 Safe 应用中运行:', environmentInfo?.type);
} else {
  // 非 Safe 环境
  console.log('在标准浏览器环境中运行');
}
```

### 2. 创建 Timelock 交易

```tsx
const createTransaction = async () => {
  try {
    const result = await createTimelockTransaction(
      TIMELOCK_CONTRACT_ADDRESS,
      TARGET_CONTRACT_ADDRESS,
      ethers.utils.parseEther('1.0').toString(),
      encodedCallData,
      executionTime
    );
    
    console.log('Safe 交易哈希:', result.safeTxHash);
    console.log('环境类型:', result.environmentType);
  } catch (error) {
    console.error('创建交易失败:', error);
  }
};
```

### 3. 批量交易

```tsx
const batchTransactions = async () => {
  const transactions = [
    {
      to: '0x...',
      value: '0',
      data: '0x...',
      operation: 0
    },
    {
      to: '0x...',
      value: ethers.utils.parseEther('1.0').toString(),
      data: '0x',
      operation: 0
    }
  ];

  const result = await sendBatchTransaction(transactions);
  console.log('批量交易哈希:', result.safeTxHash);
};
```

### 4. 使用 Context

```tsx
import { useSafeWalletContext } from '@/components/wallet/SafeWalletProvider';

export function TransactionComponent() {
  const { isSafeApp, safeInfo, createTimelockTransaction } = useSafeWalletContext();
  
  // 组件逻辑
}
```

## UI 组件

### SafeWalletInfo

显示 Safe 钱包的详细信息：

```tsx
import { SafeWalletInfo } from '@/components/wallet/SafeWalletInfo';

export function WalletSection() {
  return (
    <div>
      <h2>钱包信息</h2>
      <SafeWalletInfo />
    </div>
  );
}
```

### SafeTransactionStatus

跟踪 Safe 交易状态：

```tsx
import { SafeTransactionStatus } from '@/components/wallet/SafeTransactionStatus';

export function TransactionTracker({ txHash, safeAddress, threshold }) {
  return (
    <SafeTransactionStatus
      safeTxHash={txHash}
      safeAddress={safeAddress}
      threshold={threshold}
      confirmations={2}
      status="pending"
      chainId={1}
      onRefresh={handleRefresh}
    />
  );
}
```

## Safe Wallet vs 普通钱包

| 特性 | 普通钱包 (MetaMask) | Safe Wallet |
|------|---------------------|--------------|
| **地址类型** | EOA (外部账户) | 智能合约地址 |
| **签名机制** | 单一私钥签名 | 多重签名机制 |
| **交易执行** | 立即执行 | 需要收集签名后执行 |
| **Gas 费用** | 用户直接支付 | 可由任意签名者支付 |
| **安全性** | 依赖单一私钥 | 分布式安全，容错性强 |
| **恢复机制** | 依赖助记词/私钥 | 其他签名者可协助恢复 |

## 最佳实践

### 1. 错误处理

```tsx
const handleSafeTransaction = async () => {
  try {
    const result = await createTimelockTransaction(/* ... */);
    toast.success('交易已提交到 Safe');
  } catch (error) {
    if (error.message.includes('User denied transaction signature')) {
      toast.error('用户取消了交易');
    } else if (error.message.includes('Safe not connected')) {
      toast.error('请在 Safe App 中使用此功能');
    } else if (error.message.includes('Batch transactions not supported')) {
      toast.error('当前环境不支持批量交易');
    } else {
      toast.error(`交易失败: ${error.message}`);
    }
  }
};
```

### 2. 环境适配

```tsx
const { environmentConfig, isSafeMobileApp } = useSafeWallet();

// 根据环境调整 UI
const transactionTimeout = environmentConfig?.recommendedTimeout || 30000;
const supportsBatch = environmentConfig?.supportsBatch || false;

if (isSafeMobileApp) {
  // 移动端优化
  return <MobileOptimizedInterface />;
}
```

### 3. 权限检查

```tsx
const checkPermissions = async () => {
  if (!isSafeApp) {
    throw new Error('需要在 Safe App 环境中使用');
  }

  if (safeInfo?.isReadOnly) {
    throw new Error('Safe 处于只读模式');
  }

  const userAddress = getCurrentUserAddress();
  const isUserOwner = await isOwner(userAddress, provider);
  
  if (!isUserOwner) {
    throw new Error('您不是此 Safe 的拥有者');
  }
};
```

### 4. 状态管理

```tsx
const [transactionState, setTransactionState] = useState({
  safeTxHash: '',
  status: 'idle', // 'idle' | 'pending' | 'executed' | 'failed'
  confirmations: 0,
  threshold: 0,
  environmentType: null
});
```

## Safe App 部署

### 1. Manifest 配置

创建 `public/manifest.json`：

```json
{
  "name": "TimeLocker",
  "description": "Decentralized timelock protocol with Safe Wallet integration",
  "iconPath": "logo.svg",
  "website_url": "https://your-domain.com",
  "chain_ids": [1, 5, 137, 56],
  "provider": null,
  "id": 1
}
```

### 2. 环境变量

```env
NEXT_PUBLIC_SAFE_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_SAFE_SUPPORTED_CHAINS=1,5,137,56
```

### 3. 添加到 Safe

1. 打开 Safe 界面
2. 进入 Apps 页面  
3. 点击 "Add custom app"
4. 输入应用 URL
5. 确认添加

## 测试

### 本地测试

```bash
# 启动开发服务器
npm run dev

# 在 Safe 中打开
# https://app.safe.global/apps/open?safe=goerli:0x...&appUrl=http://localhost:3001
```

### 模拟环境

```tsx
// 开发环境模拟数据
const mockSafeInfo = {
  safeAddress: '0x...',
  chainId: 5,
  owners: ['0x...', '0x...'],
  threshold: 2,
  isReadOnly: false,
  network: 'goerli'
};

const safeInfo = process.env.NODE_ENV === 'development' 
  ? mockSafeInfo 
  : realSafeInfo;
```

## 故障排除

### 常见问题

**Q: 检测不到 Safe 环境？**
A: 检查是否正确加载 Safe Apps SDK，确保在 Safe 应用内运行。

**Q: 交易超时？**
A: 不同环境有不同的推荐超时时间，移动端需要更长时间。

**Q: 批量交易失败？**
A: 检查当前环境是否支持批量交易（WalletConnect 不支持）。

### 调试

```tsx
const { debug, error, redetect } = useSafeWallet();

console.log('调试信息:', debug);
console.log('错误信息:', error);

// 手动重新检测
redetect();
```

## 资源链接

- [Safe Apps SDK 文档](https://docs.safe.global/safe-core-aa-sdk/safe-apps)
- [Safe App 示例](https://github.com/safe-global/safe-apps-sdk)
- [TimeLocker 项目文档](/CLAUDE.md)