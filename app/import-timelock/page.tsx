'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Assuming path
import TextInput from '@/components/ui/TextInput'; // Assuming path
import SelectInput from '@/components/ui/SelectInput'; // Assuming path
import CheckParametersModal from './components/CheckParametersModal';
import QuestionIcon from '@/public/QuestionIcon.svg';
import PageLayout from '@/components/layout/PageLayout';
import { useAuthStore } from '@/store/userStore';
import { useTimelockImport, TimelockParameters } from '@/app/import-timelock/api/useTimelockImport';
import { useTimelockApi } from '@/hooks/useTimelockApi';
import { ChainUtils, getChainObject } from '@/utils/chainUtils';
import { toast } from 'sonner';
import { ImportTimelockRequest } from '@/types';
import { useActiveWalletChain, useSwitchActiveWalletChain } from 'thirdweb/react';
import { useRouter } from 'next/navigation';
import { compoundTimelockAbi } from '@/contracts/abis/CompoundTimelock';
import { useApi } from '@/hooks/useApi';

const ImportTimelockPage: React.FC = () => {
	const [selectedChain, setSelectedChain] = useState('');
	const [contractAddress, setContractAddress] = useState('');
	const [contractStandard, setContractStandard] = useState('compound');
	const [remarks, setRemarks] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [detectedParameters, setDetectedParameters] = useState<TimelockParameters | null>(null);

	const { chains, fetchChains } = useAuthStore();
	const switchChain = useSwitchActiveWalletChain();
	const { id: chainId } = useActiveWalletChain() || {};

	const { isLoading: isDetecting, parameters, fetchTimelockParameters, validateContractAddress, clearParameters } = useTimelockImport();

	const {request: importTimelockRequest} = useApi();
	const router = useRouter();

	useEffect(() => {
		fetchChains();
	}, []);


	useEffect(() => {
		if (!selectedChain && chainId) {
			setSelectedChain(chainId.toString());
		}
	}, [chainId, selectedChain]);

	useEffect(() => {
		if (selectedChain) {
			const chainObject = getChainObject(parseInt(selectedChain));
			if (chainObject) {
				switchChain(chainObject);
			}
		}
	}, [selectedChain, switchChain]);

	useEffect(() => {
		if (parameters && parameters.isValid) {
			setDetectedParameters(parameters);
		}
	}, [parameters]);

	const chainOptions = chains.map(chain => ({
		value: chain.chain_id.toString(),
		label: chain.display_name,
	}));

	const standardOptions = [{ value: 'compound', label: 'Compound' }];

	const handleContractAddressChange = (address: string) => {
		setContractAddress(address);
		if (detectedParameters) {
			setDetectedParameters(null);
			clearParameters();
		}
	};

	const handleNextStep = async () => {
		if (!selectedChain) {
			toast.error('Please select a chain');
			return;
		}

		if (!contractAddress) {
			toast.error('Please enter contract address');
			return;
		}

		if (!contractStandard) {
			toast.error('Please select contract standard');
			return;
		}

		try {
			const isValid = await validateContractAddress(contractAddress);

			if (!isValid) {
				toast.error('Invalid contract address or not a contract');
				return;
			}

			const detectedParams = await fetchTimelockParameters(contractAddress);

			if (!detectedParams.isValid) {
				toast.error('Failed to detect valid timelock parameters');
				return;
			}

			// Verify the detected standard matches user selection
			if (detectedParams.standard !== contractStandard) {
				toast.error(`Detected standard (${detectedParams.standard}) doesn't match selected standard (${contractStandard})`);
				return;
			}

			// If detection successful, open confirmation modal
			setDetectedParameters(detectedParams);
			setIsModalOpen(true);
		} catch (error) {
			console.error('Detection failed:', error);
			const errorMessage = error instanceof Error ? error.message : 'Detection failed';
			toast.error(errorMessage);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleConfirmParams = async () => {
		if (!detectedParameters || !detectedParameters.isValid) {
			toast.error('Invalid timelock parameters');
			return;
		}

		try {
			const chainId = parseInt(selectedChain);

			const importData: ImportTimelockRequest = {
				chain_id: chainId,
				contract_address: contractAddress,
				standard: detectedParameters.standard!,
				remark: remarks || 'Imported Timelock',
				is_imported: true, // Always true for imported contracts
			};

			const response = await importTimelockRequest("/api/v1/timelock/create-or-import",importData);

			if (response.success) {
				toast.success('Timelock imported successfully!');
				router.push('/timelocks');
			} else {
				const errorMessage = response.error instanceof Error ? response.error.message : 'Failed to import timelock';
				throw new Error(errorMessage);
			}
		} catch (error) {
			console.error('Import failed:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			toast.error(`Import failed: ${errorMessage}`);
		}
	};

	return (
		<PageLayout title='Timelock'>
			<div className=' bg-white p-8 flex flex-col '>
				<div className='flex-grow bg-white'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 border-b border-gray-200'>
						<div className='flex flex-col pr-8'>
							<SectionHeader
								title='导入Timelock'
								description='View and update your personal details and account information.'
								icon={<Image src={QuestionIcon} alt='Question Icon' width={15} height={15} />}
							/>
						</div>
						<div className='flex flex-col pl-8'>
							<SelectInput label='选择所在链' value={selectedChain} onChange={setSelectedChain} options={chainOptions} placeholder='选择所在链' />
							<TextInput label='合约地址' value={contractAddress} onChange={handleContractAddressChange} placeholder='0x...' />
							<SelectInput label='合约标准' value={contractStandard} onChange={setContractStandard} options={standardOptions} placeholder='Select Standard' />
							<TextInput label='备注' value={remarks} onChange={setRemarks} placeholder='Target' />
						</div>
					</div>
					<div className='mx-auto flex justify-end mt-8'>
						<button
							type='button'
							onClick={handleNextStep}
							disabled={isDetecting || !selectedChain || !contractAddress || !contractStandard}
							className='bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'>
							{isDetecting ? '检测中...' : '下一步'}
						</button>
					</div>
				</div>
				<CheckParametersModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					onConfirm={handleConfirmParams}
					abiText={JSON.stringify(compoundTimelockAbi, null, 2)}
					parameters={{chainName: ChainUtils.getChainName(chains, selectedChain),...detectedParameters}}
				/>
			</div>
		</PageLayout>
	);
};

export default ImportTimelockPage;
