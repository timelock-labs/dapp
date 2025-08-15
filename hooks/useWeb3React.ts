import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { useActiveAccount, useActiveWalletChain, useActiveWalletConnectionStatus, useConnect, useEnsName } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';

/**
 * Starting refactor useWeb3React to make it easy to replace for wagmi or thirdweb
 */
export function useWeb3React(): {
	activeAccount: ReturnType<typeof useActiveAccount>;
	account: string | undefined;
	isActive: boolean;
	chainId: number | undefined;
	chainMetadata: ReturnType<typeof useActiveWalletChain>;
	provider: ReturnType<typeof ethers5Adapter.provider.toEthers> | undefined;
	signer: any;
	isActivating: boolean;
	ENSName: string | null | undefined;
	connector: undefined;
	signMessage: ({ message, originalMessage, chainId }: { message: string; originalMessage?: string | undefined; chainId?: number | undefined }) => Promise<`0x${string}`>;
	sendTransaction: ({ to, data, value }: { to: string; data?: string | undefined; value?: string | number | bigint | undefined }) => Promise<any>;
} {
	const client = createThirdwebClient({
		clientId: '0e1974955be2e739c2b5fc550a3f6c0d',
		secretKey:"X8JMuRHwI4J3d2pO8kUzCg1_qjUy00rKc_UNX9dAFsI4uovyMgEcsKRmkLc7kyMEjID7xudU58BrWxSfDLXjIA"
	});

	const activeAccount = useActiveAccount();

	const activeChain = useActiveWalletChain();
	const status = useActiveWalletConnectionStatus();

	const { isConnecting } = useConnect();

	const { data } = useEnsName({
		client: client,
		address: activeAccount?.address,
	});

	const provider = useMemo(() => {
		if (activeChain) {
			return ethers5Adapter.provider.toEthers({
				client: client,
				chain: activeChain,
			});
		}
	}, [client, activeChain]);

	const signer = useQuery({
		queryKey: ['GET_THIRD_WEB_SIGNER', activeChain, activeAccount],
		queryFn: async () => {
			return ethers5Adapter.signer.toEthers({
				client: client,
				chain: activeChain!,
				account: activeAccount!,
			});
		},
		enabled: !!activeChain && !!activeAccount,
	});

	const signMessage =
		activeAccount ?
			activeAccount.signMessage
		:	() => {
				throw new Error('No account');
			};

	const sendTransaction =
		activeAccount ?
			async ({ to, data, value }: { to: string; data?: string | undefined; value?: string | number | bigint | undefined }) => {
				// Ensure data is a hex string if provided
				let hexData: `0x${string}` | undefined = undefined;
				if (data !== undefined) {
					hexData = data.startsWith('0x') ? (data as `0x${string}`) : (`0x${Buffer.from(data, 'utf8').toString('hex')}` as `0x${string}`);
				}
				return activeAccount.sendTransaction({
					to,
					data: hexData,
					value,
				} as any);
			}
		:	() => {
				throw new Error('No account');
			};

	return {
		activeAccount,
		account: activeAccount?.address,
		isActive: status === 'connected',
		chainId: activeChain?.id,
		chainMetadata: activeChain,
		provider,
		signer: signer.data,
		isActivating: isConnecting,
		ENSName: data,
		connector: undefined,
		signMessage,
		sendTransaction,
	};
}
