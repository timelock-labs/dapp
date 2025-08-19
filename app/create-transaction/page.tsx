'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EncodingTransactionForm from './components/EncodingTransactionForm';
import EncodingPreview from './components/EncodingPreview';
import MailboxSelection from './components/MailboxSelection';
import { useTranslations } from 'next-intl';
import { useTimelockTransaction } from '@/hooks/useTimelockTransaction';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';

import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { Interface } from 'ethers/lib/utils';
import generatePreview from '@/utils/generatePreview';
import { ethers } from 'ethers';
const TransactionEncoderPage: React.FC = () => {
	const router = useRouter();
	const t = useTranslations('CreateTransaction');
	const { sendTransaction } = useTimelockTransaction();
	const { address } = useActiveAccount() || {};
	const { id: chainId } = useActiveWalletChain() || {};
	const { allTimelocks } = useAuthStore();

	// Form States
	const [timelockType, setTimelockType] = useState('');
	const [timelockMethod, setTimelockMethod] = useState('');
	const [timelockAddress, setTimelockAddress] = useState('');
	const [target, setTarget] = useState('');
	const [value, setValue] = useState('');
	const [abiValue, setAbiValue] = useState('');
	const [functionValue, setFunctionValue] = useState('');
	const [timeValue, setTimeValue] = useState(0);
	const [argumentValues, setArgumentValues] = useState<string[]>([]);
	const [selectedMailbox, setSelectedMailbox] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [targetCalldata, setTargetCallData] = useState('');

	const [timelockCalldata, setTimelockCalldata] = useState('');

	useEffect(() => {
		if (!timeValue) {
			const now = new Date();
			now.setDate(now.getDate() + 2);
			now.setHours(14, 0, 0, 0);
			const timestamp = Math.floor(now.getTime() / 1000);
			setTimeValue(timestamp);
		}
	}, [timeValue]);

	useEffect(() => {
		setTimelockCalldata('');
		if (targetCalldata) {
			try {
				const iface = new Interface([`function ${timelockMethod}`]);
				const functionName = timelockMethod.split('(')[0];
				if (!functionName) {
					throw new Error('Invalid timelock method');
				}
				const calldata = iface.encodeFunctionData(functionName, [target, value, functionValue, targetCalldata, String(timeValue)]);
				setTimelockCalldata(calldata);
			} catch (err) {
				setTargetCallData('');
				console.error('Failed to encode calldata:', err);
			}
		}
	}, [targetCalldata, value, timelockMethod, timeValue, functionValue, target]);

	useEffect(() => {
		setTargetCallData(''); // Reset calldata when function or arguments change
		if (!!functionValue && argumentValues.length > 0) {
			try {
				const match = functionValue?.match(/\(([^)]*)\)/);
				const types = match?.[1]
					?.split(',')
					?.map((type: string) => type.trim())
					?.filter((type: string) => type.length > 0) || [];

				const args = argumentValues.map((arg, idx) =>
					types && types[idx] === 'address' ? arg
						: arg.startsWith('0x') ? arg
							: ethers.utils.parseEther(arg)
				);

				if (types?.length === args.length) {
					const calldata = ethers.utils.defaultAbiCoder.encode(
						types || [],
						args
					);
					setTargetCallData(calldata);
				}
			} catch (err) {
				setTargetCallData('');
				console.error('Failed to encode calldata:', err);
			}
		}
	}, [functionValue, argumentValues]);

	// Preview State
	const [previewContent, setPreviewContent] = useState('');

	// Handle argument changes
	const handleArgumentChange = (index: number, value: string) => {
		const newArgumentValues = [...argumentValues];
		newArgumentValues[index] = value;
		setArgumentValues(newArgumentValues);
	};

	// Handle function changes and clear arguments
	const handleFunctionChange = (value: string) => {
		setFunctionValue(value);
		setArgumentValues([]); // Clear all argument values when function changes
	};

	// Handle ABI changes and clear arguments and function
	const handleAbiChange = (value: string) => {
		setAbiValue(value);
		setFunctionValue(''); // Clear selected function when ABI changes
		setArgumentValues([]); // Clear all argument values when ABI changes
	};

	// Effect to update preview content whenever form fields change
	useEffect(() => {
		setPreviewContent(
			generatePreview({
				allTimelocks,
				timelockType,
				functionValue,
				argumentValues,
				selectedMailbox,
				timeValue,
				targetCalldata,
				abiValue,
				address,
				timelockAddress,
				timelockMethod,
				target,
				value,
				timelockCalldata,
			})
		);
	}, [
		target,
		value,
		timeValue,
		functionValue,
		argumentValues,
		address,
		timelockAddress,
		abiValue,
		timelockType,
		allTimelocks,
		timelockCalldata,
		selectedMailbox,
		targetCalldata,
		timelockMethod,
	]);

	const handleSendTransaction = async () => {
		if (!address) {
			toast.error('Please connect your wallet first');
			return;
		}

		if (!chainId) {
			toast.error('Please select a network');
			return;
		}

		// Validate required fields
		if (!timelockAddress || !target || !functionValue || !timeValue) {
			toast.error('Please fill in all required fields');
			return;
		}

		try {
			setIsSubmitting(true);

			await sendTransaction({
				// timelockAddress,
				toAddress: timelockAddress,
				calldata: timelockCalldata,
				value: value || '0', // Default to '0' if not specified
			});

			toast.success('Transaction created successfully!');

			router.push('/transactions');
		} catch (error) {
			console.error('Failed to create transaction:', error);
			toast.error((error as Error).message || 'Failed to create transaction');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<div className='min-h-screen bg-withe'>
				<div className='mx-auto flex flex-col'>
					<div className='flex justify-between gap-32'>
						<div className='w-1/2 w-max-[550px]'>
							<EncodingTransactionForm
								targetCalldata={targetCalldata}
								timelockType={timelockType}
								onTimelockTypeChange={setTimelockType}
								timelockMethod={timelockMethod}
								onTimelockMethodChange={setTimelockMethod}
								onTimelockAddressChange={setTimelockAddress}
								target={target}
								onTargetChange={setTarget}
								value={value}
								onValueChange={setValue}
								abiValue={abiValue}
								onAbiChange={handleAbiChange}
								functionValue={functionValue}
								onFunctionChange={handleFunctionChange}
								timeValue={timeValue}
								onTimeChange={setTimeValue}
								argumentValues={argumentValues}
								onArgumentChange={handleArgumentChange}
							/>
						</div>
						<div className='flex flex-col gap-4 w-1/2'>
							<EncodingPreview previewContent={previewContent} />
							<MailboxSelection selectedMailbox={selectedMailbox} onMailboxChange={setSelectedMailbox} />
							<div className='mt-auto flex justify-end'>
								<button
									type='button'
									onClick={handleSendTransaction}
									disabled={isSubmitting}
									className='cursor-pointer text-sm bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center h-[36px] text-sm disabled:opacity-50 disabled:cursor-not-allowed px-4'>
									{isSubmitting ? t('submitting') : t('sendTransactionButton')}
								</button>
							</div>
						</div>
					</div>
					{/* Submit button container */}
				</div>
			</div>
		</>
	);
};

export default TransactionEncoderPage;
