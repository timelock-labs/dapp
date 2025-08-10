import { createThirdwebClient } from 'thirdweb';
import {
	ethereum,
	sepolia,
	polygon,
	polygonMumbai,
	bsc,
	optimism,
	optimismSepolia,
	base,
	baseSepolia,
	bscTestnet,
	arbitrum,
	arbitrumSepolia,
} from 'thirdweb/chains';

// 创建 thirdweb 客户端
export const client = createThirdwebClient({
	clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || '....',
});

// 支持的链配置
export const supportedChains = [
	ethereum,
	sepolia,
	polygon,
	polygonMumbai,
	bsc,
	bscTestnet,
	optimism,
	optimismSepolia,
	base,
	baseSepolia,
	arbitrum,
	arbitrumSepolia,
];

// 默认链
export const defaultChain = ethereum;
