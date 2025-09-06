'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { checkSafeTransactionStatus, type SupportedChainId, type SafeDeploymentTransactionData } from '@/utils/safeService';
import ParameterDisplayRow from './ParameterDisplayRow';
import ChainLabel from '@/components/web3/ChainLabel';
import AddressWarp from '@/components/web3/AddressWarp';

interface SafeDeploymentSuccessDialogProps {
	isOpen: boolean;
	onClose: () => void;
	safeAddress: string;
	safeTxHash: string;
	safeAppUrl: string;
	chainId: number;
	message: string;
	proposalSubmitted: boolean;
	transactionData?: SafeDeploymentTransactionData;
}

const SafeDeploymentSuccessDialog: React.FC<SafeDeploymentSuccessDialogProps> = ({
	isOpen,
	onClose,
	safeAddress,
	safeTxHash,
	safeAppUrl,
	chainId,
	message,
	proposalSubmitted,
	transactionData,
}) => {
	const dialogRef = useRef<HTMLDivElement>(null);
	const [transactionStatus, setTransactionStatus] = useState<any>(null);
	const [isCheckingStatus, setIsCheckingStatus] = useState(false);
	const [copied, setCopied] = useState<{ [key: string]: boolean }>({});


	useEffect(() => {
		if (!isOpen) return;

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEscape);

		if (dialogRef.current) {
			dialogRef.current.focus();
		}

		// Check transaction status if proposal was submitted
		if (proposalSubmitted && safeTxHash) {
			checkTransactionStatus();
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, onClose, proposalSubmitted, safeTxHash]);

	const checkTransactionStatus = async () => {
		setIsCheckingStatus(true);
		try {
			const status = await checkSafeTransactionStatus(safeTxHash, chainId as SupportedChainId);
			setTransactionStatus(status);
		} catch (error) {
			console.error('Failed to check transaction status:', error);
			// Don't show error to user, it's not critical
		} finally {
			setIsCheckingStatus(false);
		}
	};

	const copyToClipboard = async (text: string, key: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied({ ...copied, [key]: true });
			toast.success('Copied to clipboard!');
			setTimeout(() => {
				setCopied({ ...copied, [key]: false });
			}, 2000);
		} catch (error) {
			toast.error('Failed to copy to clipboard');
		}
	};

	const openSafeApp = () => {
		window.open(safeAppUrl, '_blank', 'noopener,noreferrer');
	};

	const generateTransactionJSON = () => {
		if (!transactionData) return null;
		
		return {
			version: "1.0",
			chainId: chainId.toString(),
			createdAt: Date.now(),
			meta: {
				name: "Timelock Deployment Transaction",
				description: "Automated timelock contract deployment for Safe wallet",
				txBuilderVersion: "1.17.1",
				createdFromSafeAddress: safeAddress,
				createdFromOwnerAddress: "",
				checksum: safeTxHash
			},
			transactions: [
				{
					to: transactionData.to,
					value: transactionData.value,
					data: transactionData.data,
					contractMethod: {
						inputs: [
							{ "type": "address", "name": "_admin" },
							{ "type": "uint256", "name": "_delay" }
						],
						name: "constructor",
						payable: false
					},
					contractInputsValues: null
				}
			]
		};
	};

	const downloadTransactionJSON = () => {
		const jsonData = generateTransactionJSON();
		if (!jsonData) {
			toast.error('No transaction data available for export');
			return;
		}

		const dataStr = JSON.stringify(jsonData, null, 2);
		const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
		
		const exportFileDefaultName = `timelock-deployment-${safeAddress.slice(0, 8)}.json`;
		
		const linkElement = document.createElement('a');
		linkElement.setAttribute('href', dataUri);
		linkElement.setAttribute('download', exportFileDefaultName);
		linkElement.click();
		
		toast.success('Transaction JSON downloaded successfully!');
	};

	const getStatusDisplay = () => {
		if (isCheckingStatus) {
			return <span className="text-yellow-600">🔄 Checking...</span>;
		}
		
		if (!proposalSubmitted) {
			return <span className="text-orange-600">📋 Manual creation required</span>;
		}

		if (transactionStatus) {
			if (transactionStatus.isExecuted) {
				return <span className="text-green-600">✅ Executed</span>;
			} else if (transactionStatus.confirmations?.length > 0) {
				return (
					<span className="text-blue-600">
						📝 {transactionStatus.confirmations.length}/{transactionStatus.confirmationsRequired} signatures
					</span>
				);
			} else {
				return <span className="text-yellow-600">⏳ Awaiting signatures</span>;
			}
		}

		return <span className="text-green-600">✅ Proposal created</span>;
	};

	if (!isOpen) return null;

	const dialogTitleId = 'safe-deployment-success-dialog-title';

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
			<div
				ref={dialogRef}
				role='dialog'
				aria-modal='true'
				aria-labelledby={dialogTitleId}
				tabIndex={-1}
				className='bg-white p-6 rounded-lg w-full max-w-2xl mx-4 relative outline-none max-h-[90vh] overflow-y-auto'>
				
				<div className="flex items-center justify-between mb-6">
					<h2 id={dialogTitleId} className='text-xl font-semibold text-green-600'>
						🎉 Safe Deployment Success
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
						aria-label="Close dialog"
					>
						×
					</button>
				</div>

				{/* Status */}
				<div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
					<div className="flex items-center justify-between">
						<span className="font-medium">Status:</span>
						{getStatusDisplay()}
					</div>
				</div>

				{/* Transaction Details */}
				<div className='flex flex-col gap-3 mb-6'>
					<ParameterDisplayRow label="Chain">
						<ChainLabel chainId={chainId} />
					</ParameterDisplayRow>
					
					<ParameterDisplayRow label="Safe Address">
						<div className="flex items-center gap-2">
							<AddressWarp address={safeAddress} />
							<button
								onClick={() => copyToClipboard(safeAddress, 'safeAddress')}
								className="text-blue-600 hover:text-blue-800 text-sm"
							>
								{copied.safeAddress ? '✅' : '📋'}
							</button>
						</div>
					</ParameterDisplayRow>

					<ParameterDisplayRow label="Transaction Hash">
						<div className="flex items-center gap-2">
							<code className="text-sm bg-gray-100 px-2 py-1 rounded">
								{safeTxHash.slice(0, 20)}...{safeTxHash.slice(-20)}
							</code>
							<button
								onClick={() => copyToClipboard(safeTxHash, 'safeTxHash')}
								className="text-blue-600 hover:text-blue-800 text-sm"
							>
								{copied.safeTxHash ? '✅' : '📋'}
							</button>
						</div>
					</ParameterDisplayRow>

					<ParameterDisplayRow label="Safe App URL">
						<div className="flex items-center gap-2">
							<code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 truncate">
								{safeAppUrl}
							</code>
							<button
								onClick={() => copyToClipboard(safeAppUrl, 'safeAppUrl')}
								className="text-blue-600 hover:text-blue-800 text-sm"
							>
								{copied.safeAppUrl ? '✅' : '📋'}
							</button>
						</div>
					</ParameterDisplayRow>
				</div>

				{/* Transaction Data */}
				{transactionData && (
					<div className='flex flex-col gap-3 mb-6'>
						<h3 className="text-lg font-medium mb-3">📋 Transaction Data (Pre-filled in Safe App)</h3>
						
						<ParameterDisplayRow label="To Address">
							<div className="flex items-center gap-2">
								<AddressWarp address={transactionData.to} />
								<span className="text-sm text-gray-500">(Contract Deployment)</span>
								<button
									onClick={() => copyToClipboard(transactionData.to, 'txTo')}
									className="text-blue-600 hover:text-blue-800 text-sm"
								>
									{copied.txTo ? '✅' : '📋'}
								</button>
							</div>
						</ParameterDisplayRow>

						<ParameterDisplayRow label="Value">
							<div className="flex items-center gap-2">
								<code className="text-sm bg-gray-100 px-2 py-1 rounded">
									{transactionData.value} ETH
								</code>
								<button
									onClick={() => copyToClipboard(transactionData.value, 'txValue')}
									className="text-blue-600 hover:text-blue-800 text-sm"
								>
									{copied.txValue ? '✅' : '📋'}
								</button>
							</div>
						</ParameterDisplayRow>

						<ParameterDisplayRow label="Contract Data">
							<div className="flex items-center gap-2">
								<code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 truncate max-w-md">
									{transactionData.data.slice(0, 50)}...
								</code>
								<button
									onClick={() => copyToClipboard(transactionData.data, 'txData')}
									className="text-blue-600 hover:text-blue-800 text-sm"
								>
									{copied.txData ? '✅' : '📋'}
								</button>
							</div>
						</ParameterDisplayRow>
					</div>
				)}

				{/* JSON Import Workflow Notice for manual mode */}
				{!proposalSubmitted && (
					<div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
						<div className="flex items-center mb-2">
							<span className="text-lg">📋</span>
							<h3 className="font-medium ml-2">JSON Import Workflow</h3>
						</div>
						<p className="text-sm text-yellow-800">
							Safe Transaction Builder doesn't support URL pre-filling. You'll need to download the JSON file and manually import it in Safe App.
						</p>
					</div>
				)}

				{/* Instructions */}
				<div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
					<h3 className="font-medium mb-3">Next Steps</h3>
					<ol className="space-y-2 text-sm">
						{proposalSubmitted ? (
							<>
								<li>1. Click "Open Safe App" below to view the transaction</li>
								<li>2. Review the transaction details in Safe App</li>
								<li>3. Sign the transaction with your wallet</li>
								<li>4. Collect additional signatures from other Safe owners</li>
								<li>5. Execute the transaction once threshold is reached</li>
							</>
						) : (
							<>
								<li>1. <strong>Click "Download JSON" below</strong> to save the transaction file</li>
								<li>2. <strong>Click "Open Safe App"</strong> to access Transaction Builder</li>
								<li>3. In Safe App: <strong>Import the JSON file</strong> you just downloaded</li>
								<li>4. Review the timelock deployment transaction details</li>
								<li>5. Sign and collect required signatures from Safe owners</li>
								<li>6. Execute the transaction once threshold is reached</li>
							</>
						)}
					</ol>
				</div>

				{/* Message */}
				{message && (
					<div className="mb-6 p-3 bg-gray-50 rounded border text-sm">
						{message}
					</div>
				)}

				{/* Action Buttons */}
				<div className='flex justify-between items-center'>
					<div className="flex gap-3">
						{proposalSubmitted && (
							<button
								onClick={checkTransactionStatus}
								disabled={isCheckingStatus}
								className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50"
							>
								{isCheckingStatus ? '🔄 Checking...' : '🔄 Refresh Status'}
							</button>
						)}
					</div>
					
					<div className="flex gap-3">
						<button
							type='button'
							onClick={onClose}
							className='px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors'
						>
							Close
						</button>
						<button
							onClick={downloadTransactionJSON}
							className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
							disabled={!transactionData}
						>
							📥 Download JSON {!transactionData ? '(No Data)' : ''}
						</button>
						<button
							type='button'
							onClick={openSafeApp}
							className='px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium'
						>
							🚀 Open Safe App
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SafeDeploymentSuccessDialog;