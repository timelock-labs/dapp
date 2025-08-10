'use client';

import Image from 'next/image';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useApi } from '@/hooks/useApi';
import { useDeployTimelock } from '@/hooks/useDeployTimelock';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain } from 'thirdweb/react';
import { useRouter, useParams } from 'next/navigation';
import CreateTimelockForm from './components/CreateTimelockForm';
import ConfirmCreationDialog from './components/ConfirmCreationDialog';
import PageLayout from '@/components/layout/PageLayout';
import { getChainObject } from '@/utils/chainUtils';
import type { CreateTimelockFormState, CreationDetails, CreateTimelockRequestBody, DeploymentResult, CompoundTimelockParams } from './components/types';
import type { ContractStandard } from '@/types/common';

const CreateTimelockPage: React.FC = () => {
	const t = useTranslations('CreateTimelock');

	const [formState, setFormState] = useState<CreateTimelockFormState>({
		selectedChain: 1,
		selectedStandard: 'compound',
		minDelay: '259200',
		owner: '', // 将在钱包连接后设置为钱包地址
	});

	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [dialogDetails, setDialogDetails] = useState<CreationDetails>({
		chainName: '',
		chainIcon: <Image src='' alt='Chain Logo' width={16} height={16} className='mr-1' />,
		timelockAddress: '',
		initiatingAddress: '',
		transactionHash: '',
	});

	const { id: chainId } = useActiveWalletChain() || {};
	const switchChain = useSwitchActiveWalletChain();
	const { request: createTimelockApiCall } = useApi();
	const { chains } = useAuthStore();
	const { address: walletAddress } = useActiveAccount() || {};
	const { deployCompoundTimelock, isLoading } = useDeployTimelock();
	const router = useRouter();

	const selectedChainData = useMemo(() => chains.find(chain => chain.chain_id === formState.selectedChain), [chains, formState.selectedChain]);

	const handleChainChange = useCallback(
		(newChainId: number) => {
			if (!newChainId) {
				toast.error('Please select a network');
				return;
			}

			setFormState(prev => ({ ...prev, selectedChain: newChainId }));

			// Get the thirdweb chain object for the given chain ID
			const chainObject = getChainObject(newChainId);

			if (!chainObject) {
				console.error(`Chain ID ${newChainId} is not supported by thirdweb`);
				toast.error(`Chain ID ${newChainId} is not supported. Please use a supported network.`);
				return;
			}

			switchChain(chainObject);
		},
		[switchChain]
	);

	const handleStandardChange = useCallback((standard: ContractStandard) => {
		setFormState(prev => ({ ...prev, selectedStandard: standard }));
	}, []);

	const handleMinDelayChange = useCallback((minDelay: string) => {
		setFormState(prev => ({ ...prev, minDelay }));
	}, []);

	const handleOwnerChange = useCallback((owner: string) => {
		setFormState(prev => ({ ...prev, owner }));
	}, []);

	// Deployment handlers
	const handleCreate = useCallback(async () => {
		// Validation
		if (!formState.selectedChain || !formState.minDelay) {
			toast.error('Please fill in all required fields.');
			return;
		}

		let deployedContractAddress: string | null = null;
		let transactionHash: string | null = null;

		try {
			if (formState.selectedStandard === 'compound') {
				const params: CompoundTimelockParams = {
					minDelay: parseInt(formState.minDelay),
					admin: (formState.owner || walletAddress) as `0x${string}`,
				};
				const result: DeploymentResult = await deployCompoundTimelock(params);
				deployedContractAddress = result.contractAddress;
				transactionHash = result.transactionHash;
			}

			if (deployedContractAddress && transactionHash) {
				const chainName = selectedChainData?.chain_name || 'Unsupport Chain';

				setDialogDetails({
					chainName,
					chainIcon: <Image src='' alt='Chain Logo' width={16} height={16} className='mr-1' />,
					timelockAddress: deployedContractAddress,
					initiatingAddress: walletAddress,
					transactionHash,
				});
				setIsConfirmDialogOpen(true);
			}
		} catch (error) {
			console.error('Deployment failed:', error);
			// The useDeployTimelock hook already handles toast messages for errors.
		}
	}, [walletAddress, formState, selectedChainData, deployCompoundTimelock]);

	const handleConfirmDialogClose = useCallback(() => {
		setIsConfirmDialogOpen(false);
	}, []);

	const handleConfirmDialogConfirm = useCallback(
		async (remarkFromDialog: string) => {
			if (!walletAddress) {
				toast.error('Please connect your wallet.');
				return;
			}

			const body: CreateTimelockRequestBody = {
				chain_id: formState.selectedChain,
				remark: remarkFromDialog || '',
				standard: formState.selectedStandard,
				contract_address: dialogDetails.timelockAddress,
				is_imported: false, // Always false for new timelocks
			};

			try {
				const apiResponse = await createTimelockApiCall('/api/v1/timelock/create-or-import', {
					method: 'POST',
					body,
				});

				if (apiResponse && apiResponse.success) {
					toast.success('Timelock created successfully!');
					// Reset form
					setFormState({
						selectedChain: 1,
						selectedStandard: 'compound',
						minDelay: '259200',
						owner: walletAddress || '',
					});
					// Redirect to timelocks page
					router.push(`/timelocks`);
				} else {
					throw new Error(apiResponse?.error?.message || 'Failed to create timelock record');
				}
			} catch (error: unknown) {
				console.error('API Error:', error);
				const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
				toast.error('Failed to create timelock record', {
					description: errorMessage,
				});
			} finally {
				setIsConfirmDialogOpen(false);
			}
		},
		[walletAddress, formState, dialogDetails, createTimelockApiCall, router]
	);

	// Effect to sync chain ID
	useEffect(() => {
		if (chainId) {
			setFormState(prev => ({ ...prev, selectedChain: chainId }));
		}
	}, [chainId]);

	// Effect to set default owner when wallet connects
	useEffect(() => {
		if (walletAddress && (!formState.owner || formState.owner === '')) {
			setFormState(prev => ({ ...prev, owner: walletAddress }));
		}
	}, [walletAddress, formState.owner]);

	return (
		<PageLayout title={t('createTimelock')}>
			<div className='bg-white p-8'>
				<div className='mx-auto flex flex-col space-y-8'>
					{/* Main Form Area */}
					<CreateTimelockForm
						selectedChain={formState.selectedChain}
						onChainChange={handleChainChange}
						selectedStandard={formState.selectedStandard}
						onStandardChange={handleStandardChange}
						minDelay={formState.minDelay}
						onMinDelayChange={handleMinDelayChange}
						owner={formState.owner || ''}
						onOwnerChange={handleOwnerChange}
						onDeploy={handleCreate}
						isLoading={isLoading}
					/>
				</div>

				<ConfirmCreationDialog isOpen={isConfirmDialogOpen} onClose={handleConfirmDialogClose} onConfirm={handleConfirmDialogConfirm} creationDetails={dialogDetails} />
			</div>
		</PageLayout>
	);
};
export default CreateTimelockPage;
