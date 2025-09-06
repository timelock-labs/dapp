'use client';

// React imports
import { useCallback, useMemo } from 'react';

// External libraries
import type { ContractInterface } from 'ethers';
import { useActiveAccount } from 'thirdweb/react';

// Internal contracts
import { compoundTimelockAbi } from '@/contracts/abis/CompoundTimelock';
import { compoundTimelockBytecode } from '@/contracts/bytecodes/CompoundTimelock';

// Internal hooks
import { useAsyncOperation } from './useCommonHooks';
import { useContractDeployment, useWalletConnection } from './useBlockchainHooks';
import { validateRequiredFields } from './useHookUtils';
import { useWeb3React } from './useWeb3React';
import { useTranslations } from 'next-intl';

// Internal utilities
import { 
	createSafeDeploymentProposal, 
	isSafeWallet, 
	getSafeInfo,
	type SupportedChainId 
} from '@/utils/safeService';

// Type imports
import type { 
	CompoundTimelockParams, 
	ContractStandard, 
	DeploymentResult, 
	OpenZeppelinTimelockParams,
	SafeDeploymentConfig,
	WalletTypeInfo 
} from '@/types';

/**
 * Configuration for timelock deployment
 */
interface TimelockDeploymentConfig extends SafeDeploymentConfig {
	/** Whether to validate parameters before deployment */
	validateParams?: boolean;
	/** Custom gas limit for deployment */
	gasLimit?: number;
	/** Custom gas price for deployment */
	gasPrice?: string;
	/** Whether to force Safe mode even if EOA is detected */
	forceSafeMode?: boolean;
}

/**
 * Hook for deploying timelock contracts using standardized blockchain patterns
 * Provides optimized deployment methods with proper error handling and validation
 *
 * @param config Optional configuration for deployment behavior
 * @returns Object containing deployment methods and state
 */
export const useDeployTimelock = (config: TimelockDeploymentConfig = { chainId: 1 }) => {
	const { 
		validateParams = true, 
		gasLimit, 
		gasPrice, 
		chainId
	} = config;
	const { deployContract, isLoading, error, reset } = useContractDeployment();
	const { chainId: connectedChainId } = useWalletConnection();
	const { signer } = useWeb3React();
	const activeAccount = useActiveAccount();
	const t = useTranslations('common');

	// Separate async operation for parameter validation
	const { execute: executeWithValidation, isLoading: isValidating } = useAsyncOperation({
		loadingMessage: t('validatingDeploymentParameters'),
		errorMessage: t('parameterValidationFailed'),
		showToasts: false,
	});

	// Separate async operation for wallet type detection
	const { execute: executeWalletDetection, isLoading: isDetectingWallet } = useAsyncOperation({
		loadingMessage: t('detectingWalletType'),
		errorMessage: t('walletTypeDetectionFailed'),
		showToasts: false,
	});

	// Memoize deployment options
	const deploymentOptions = useMemo(
		() => ({
			gasLimit,
			gasPrice,
		}),
		[gasLimit, gasPrice]
	);

	/**
	 * Detect wallet type and return wallet information
	 */
	const detectWalletType = useCallback(async (): Promise<WalletTypeInfo | null> => {
		if (!activeAccount?.address || !signer) {
			return null;
		}

		return executeWalletDetection(async () => {
			try {
				const currentChainId = (connectedChainId || 1) as SupportedChainId;
				// Check if it's a Safe wallet
				const isSafe = await isSafeWallet(activeAccount.address, signer, currentChainId);
				
				if (isSafe) {
					const safeInfo = await getSafeInfo(activeAccount.address, signer, currentChainId);
					return {
						address: activeAccount.address,
						type: 'safe',
						isMultiSig: true,
						safeInfo: {
							address: activeAccount.address,
							owners: safeInfo.owners,
							threshold: safeInfo.threshold,
							nonce: safeInfo.nonce,
							chainId: currentChainId,
							isMultiSig: true,
						},
					};
				} else {
					return {
						address: activeAccount.address,
						type: 'eoa',
						isMultiSig: false,
					};
				}
			} catch (error) {
				console.error('Wallet type detection failed:', error);
				// Default to EOA if detection fails
				return {
					address: activeAccount.address,
					type: 'eoa',
					isMultiSig: false,
				};
			}
		});
	}, [activeAccount, signer, chainId, connectedChainId, executeWalletDetection]);

	/**
	 * Validate Compound timelock parameters
	 */
	const validateCompoundParams = useCallback((params: CompoundTimelockParams): string[] => {
		const errors = validateRequiredFields(params, ['admin', 'minDelay']);

		if (params.minDelay < 0) {
			errors.push(t('minimumDelayMustBeNonNegative'));
		}

		if (params.minDelay > 30 * 24 * 60 * 60) {
			// 30 days in seconds
			errors.push(t('minimumDelayCannotExceed30Days'));
		}

		return errors;
	}, [t]);

	/**
	 * Deploy Compound timelock contract with Safe support and validation
	 */
	const deployCompoundTimelock = useCallback(
		async (params: CompoundTimelockParams): Promise<DeploymentResult> => {
			return executeWithValidation(async () => {
				// Validate parameters if enabled
				if (validateParams) {
					const validationErrors = validateCompoundParams(params);
					if (validationErrors.length > 0) {
						throw new Error(t('validationFailed', { message: validationErrors.join(', ') }));
					}
				}

				// Detect wallet type
				const walletInfo = await detectWalletType();

				if (!walletInfo) {
					throw new Error(t('walletNotConnectedOrDetected'));
				}

				// Handle Safe wallet deployment
				if (walletInfo.type === 'safe') {

					if (!signer) {
						throw new Error(t('signerNotAvailable'));
					}

					try {
						const currentChainId = (connectedChainId || 1) as SupportedChainId;
						
						const safeResult = await createSafeDeploymentProposal(
							compoundTimelockAbi as ContractInterface,
							compoundTimelockBytecode,
							[params.admin, BigInt(params.minDelay)],
							signer,
							walletInfo.address,
							currentChainId,
							'0' // No ETH value for deployment
						);
						
						
						if (!safeResult.success) {
							throw new Error(safeResult.error || t('safeProposalCreationFailed'));
						}

						// Return Safe deployment result
						return {
							contractAddress: null, // Will be known after execution
							transactionHash: safeResult.safeTxHash || '',
							walletType: 'safe',
							standard: 'compound' as ContractStandard,
							parameters: params,
							requiresMultiSig: true,
							success: safeResult.success,
							error: safeResult.error,
							safeProposal: {
								safeTxHash: safeResult.safeTxHash || '',
								safeAddress: walletInfo.address,
								proposalSubmitted: safeResult.proposalSubmitted || false,
								message: safeResult.message,
								safeAppUrl: safeResult.safeAppUrl,
								transactionData: safeResult.transactionData,
							},
						};
					} catch (error) {
						throw new Error(t('safeDeploymentFailed', { 
							message: error instanceof Error ? error.message : 'Unknown error' 
						}));
					}
				}

				// Handle regular EOA deployment
				const result = await deployContract(
					compoundTimelockAbi as ContractInterface, 
					compoundTimelockBytecode, 
					[params.admin, BigInt(params.minDelay)], 
					deploymentOptions
				);

				return {
					...result,
					walletType: 'eoa',
					standard: 'compound' as ContractStandard,
					parameters: params,
					requiresMultiSig: false,
					success: true,
				};
			});
		},
		[deployContract, executeWithValidation, validateParams, validateCompoundParams, deploymentOptions, detectWalletType, signer, chainId, connectedChainId, t]
	);

	/**
	 * Deploy OpenZeppelin timelock contract (placeholder for future implementation)
	 */
	const deployOpenZeppelinTimelock = useCallback(
		// async (_params: OpenZeppelinTimelockParams): Promise<DeploymentResult> => {
		async (): Promise<DeploymentResult> => {
			return executeWithValidation(async () => {
				// TODO: Implement OpenZeppelin timelock deployment
				// This is a placeholder for future implementation
				throw new Error(t('openZeppelinTimelockDeploymentNotImplemented'));
			});
		},
		[executeWithValidation]
	);

	/**
	 * Get deployment cost estimation
	 */
	const estimateDeploymentCost = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		async (standard: ContractStandard, _params: CompoundTimelockParams | OpenZeppelinTimelockParams) => {
			if (standard === 'compound') {
				// This would typically use gas estimation
				// For now, return a placeholder
				return {
					gasLimit: gasLimit || 2000000,
					gasPrice: gasPrice || '20000000000', // 20 gwei
					estimatedCost: '0.04', // ETH
				};
			}

			throw new Error(t('costEstimationNotAvailableForTimelock', { standard }));
		},
		[gasLimit, gasPrice]
	);

	/**
	 * Check if deployment is supported for the given standard
	 */
	const isDeploymentSupported = useCallback((standard: ContractStandard): boolean => {
		return standard === 'compound';
	}, []);

	return {
		// Deployment methods
		deployCompoundTimelock,
		deployOpenZeppelinTimelock,

		// Utility methods
		estimateDeploymentCost,
		isDeploymentSupported,
		validateCompoundParams,
		detectWalletType,

		// State
		isLoading: isLoading || isValidating || isDetectingWallet,
		isValidating,
		isDetectingWallet,
		error,

		// Actions
		reset,
	};
};
