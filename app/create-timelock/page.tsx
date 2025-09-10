'use client';

import Image from 'next/image';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useApi } from '@/hooks/useApi';
import { useDeployTimelock } from '@/hooks/useDeployTimelock';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain, useActiveWallet } from 'thirdweb/react';
import { useRouter } from 'next/navigation';
import CreateTimelockForm from './components/CreateTimelockForm';
import ConfirmCreationDialog from './components/ConfirmCreationDialog';
import SafeDeploymentSuccessDialog from './components/SafeDeploymentSuccessDialog';
import { getChainObject } from '@/utils/chainUtils';
import { isSafeWallet } from '@/utils/walletUtils';
import type { CreateTimelockFormState, CreationDetails, CompoundTimelockParams } from '@/types';

const CreateTimelockPage: React.FC = () => {
	const t = useTranslations('CreateTimelock');

	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [isSafeDialogOpen, setIsSafeDialogOpen] = useState(false);
	const [safeDialogData, setSafeDialogData] = useState<{
		safeAddress: string;
		safeTxHash: string;
		safeAppUrl: string;
		chainId: number;
		message: string;
		proposalSubmitted: boolean;
		predictedAddress?: string;
		transactionData?: any;
	} | null>(null);

	const [formState, setFormState] = useState<CreateTimelockFormState>({
		selectedChain: 0,
		selectedStandard: 'compound',
		minDelay: '172800',
		owner: '',
	});

	const [dialogDetails, setDialogDetails] = useState<CreationDetails>({
		chain_id: "",
		chainName: '',
		chainIcon: <Image src='' alt='Chain Logo' width={16} height={16} className='mr-1' />,
		timelockAddress: '',
		initiatingAddress: '',
		transactionHash: '',
		explorerUrl: '',
	});

	const { id: chainId } = useActiveWalletChain() || {};
	const switchChain = useSwitchActiveWalletChain();
	const { request: createTimelockReq, data: createTimelockData } = useApi();
	const { chains } = useAuthStore();
	const { address: walletAddress } = useActiveAccount() || {};
	const { deployCompoundTimelock, isLoading } = useDeployTimelock();
	const router = useRouter();
	const wallet = useActiveWallet();

	const selectedChainData = useMemo(() => chains.find(chain => chain.chain_id === formState.selectedChain), [chains, formState.selectedChain]);

	const isWalletSafe = useMemo(() => isSafeWallet(wallet), [wallet]);

	useEffect(() => {
		if (chainId && chainId !== formState.selectedChain) {
			setFormState(prev => ({ ...prev, selectedChain: chainId }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId]);

	useEffect(() => {
		if (walletAddress && (!formState.owner || formState.owner === '')) {
			setFormState(prev => ({ ...prev, owner: walletAddress }));
		}
	}, [walletAddress, formState.owner]);

	useEffect(() => {
		if (createTimelockData?.success) {
			toast.success(t('success'));
			router.push(`/timelocks`);
		} else if (createTimelockData && !createTimelockData.success) {
			toast.error(t('failed', { message: createTimelockData?.error?.message || 'Unknown error occurred' }));
		}
	}, [createTimelockData, router, t]);

	const handleChainChange = useCallback(
		(newChainId: number) => {
			if (!newChainId) {
				toast.error(t('pleaseSelectNetwork'));
				return;
			}

			setFormState(prev => ({ ...prev, selectedChain: newChainId }));
			const chainObject = getChainObject(newChainId);

			if (!chainObject) {
				toast.error(t('chainNotSupported', { chainId: newChainId }));
				return;
			}
			switchChain(chainObject);
		},
		[switchChain, t]
	);

	const handleMinDelayChange = useCallback((minDelay: string) => {
		setFormState(prev => ({ ...prev, minDelay }));
	}, []);

	const handleOwnerChange = useCallback((owner: string) => {
		setFormState(prev => ({ ...prev, owner }));
	}, []);

	const handleCreate = async () => {
		try {
			const params: CompoundTimelockParams = {
				minDelay: parseInt(formState.minDelay),
				admin: (formState.owner || walletAddress) as `0x${string}`,
			};
			
			const result = await deployCompoundTimelock(params);

			if (result.walletType === 'safe') {
				// Handle Safe wallet deployment
				if (result.success !== false) {
					// Show Safe-specific success message
					const message = result.safeProposal?.proposalSubmitted 
						? 'Safe deployment proposal created successfully!' 
						: 'Safe deployment transaction prepared! Please complete in Safe App.';
					toast.success(message);
					
					// Use the Safe App URL for Transaction Builder access
					const safeAppUrl = result.safeProposal?.safeAppUrl || '';

					// Show Safe deployment success dialog
					setSafeDialogData({
						safeAddress: result.safeProposal?.safeAddress || '',
						safeTxHash: result.transactionHash || '',
						safeAppUrl: safeAppUrl,
						chainId: formState.selectedChain,
						message: result.safeProposal?.message || '',
						proposalSubmitted: result.safeProposal?.proposalSubmitted || false,
						predictedAddress: result.predictedAddress,
						transactionData: result.safeProposal?.transactionData,
					});
					setIsSafeDialogOpen(true);
				} else {
					toast.error(result.error || 'Failed to create Safe deployment proposal');
				}
			} else {
				// Handle regular EOA wallet deployment
				const { contractAddress, transactionHash } = result;

				if (contractAddress && transactionHash) {
					setDialogDetails({
						chain_id: formState.selectedChain,
						chainName: selectedChainData?.display_name || 'Unsupported Chain',
						chainIcon: <Image src={selectedChainData?.logo_url || ''} alt='Chain Logo' width={16} height={16} className='mr-1' />,
						timelockAddress: contractAddress,
						initiatingAddress: formState.owner as string,
						transactionHash,
						explorerUrl: selectedChainData?.block_explorer_urls as string,
					});
					setIsConfirmDialogOpen(true);
				} else {
					toast.error('Deployment failed: No contract address returned');
				}
			}
		} catch (error) {
			console.error('Deployment error:', error);
			toast.error(error instanceof Error ? error.message : 'Deployment failed with unknown error');
		}
	};


	const handleConfirmDialogConfirm = async (remarkFromDialog: string) => {
		await createTimelockReq('/api/v1/timelock/create-or-import', {
			chain_id: formState.selectedChain,
			remark: remarkFromDialog || '',
			standard: 'compound',
			contract_address: dialogDetails.timelockAddress,
			is_imported: false,
		});

		setIsConfirmDialogOpen(false);
	};

	return (
		<>
			<div className='bg-white p-8'>
				<div className='mx-auto flex flex-col space-y-8'>
					{/* Main Form Area */}
					<CreateTimelockForm
						selectedChain={formState.selectedChain}
						onChainChange={handleChainChange}
						selectedStandard={'compound'}
						minDelay={formState.minDelay}
						onMinDelayChange={handleMinDelayChange}
						owner={formState.owner || ''}
						onOwnerChange={handleOwnerChange}
						onDeploy={handleCreate}
						isLoading={isLoading}
						isSafeWallet={isWalletSafe}
					/>
				</div>

				<ConfirmCreationDialog isOpen={isConfirmDialogOpen} onClose={() => setIsConfirmDialogOpen(false)} onConfirm={handleConfirmDialogConfirm} creationDetails={dialogDetails} />
				
				{/* Safe Deployment Success Dialog */}
				{safeDialogData && (
					<SafeDeploymentSuccessDialog
						isOpen={isSafeDialogOpen}
						onClose={() => setIsSafeDialogOpen(false)}
						safeAddress={safeDialogData.safeAddress}
						safeTxHash={safeDialogData.safeTxHash}
						safeAppUrl={safeDialogData.safeAppUrl}
						chainId={safeDialogData.chainId}
						message={safeDialogData.message}
						proposalSubmitted={safeDialogData.proposalSubmitted}
						predictedAddress={safeDialogData.predictedAddress}
						transactionData={safeDialogData.transactionData}
					/>
				)}
			</div>
		</>
	);
};
export default CreateTimelockPage;
