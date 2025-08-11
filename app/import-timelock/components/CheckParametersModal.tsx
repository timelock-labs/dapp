// components/CheckParametersDialog.tsx
import React, { useState, useEffect, useRef, use } from 'react';
import { compoundTimelockAbi } from '@/contracts/abis/CompoundTimelock';

// Define interface for the data this dialog will display
interface CheckParametersDialogProps {
	isOpen: boolean; // Controls if the dialog is visible
	onClose: () => void; // Callback to close the dialog (used by buttons & Escape key)
	onConfirm: (abiContent: string) => void; // Callback on confirm, passes updated ABI content
	abiText: string;
	parameters: {
		chainName: string;
		chainIcon?: React.ReactNode;
		isValid: boolean;
		standard: string;
		contractAddress: string;
		minDelay: number;
		admin: string;
		gracePeriod: number;
		minimumDelay: number;
		maximumDelay: number;
	};
}

const CheckParametersDialog: React.FC<CheckParametersDialogProps> = ({ isOpen, onClose, onConfirm, abiText, parameters }) => {
	const [abiContent, setAbiContent] = useState(abiText || []);
	const dialogRef = useRef<HTMLDivElement>(null);

	
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

		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, onClose]);

	useEffect(() => {
		
		setAbiContent(JSON.stringify(compoundTimelockAbi, null, 2));
	}, []);

	
	if (!isOpen) return null;

	const handleConfirm = () => {
		onConfirm(abiContent);
		setAbiContent(JSON.stringify(compoundTimelockAbi, null, 2)); 
	};

	const handleCancel = () => {
		onClose();
		setAbiContent(JSON.stringify(compoundTimelockAbi, null, 2)); 
	};

	
	const ParameterDisplayRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
		<div className='mb-4'>
			<label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
			<div className='bg-gray-100 text-gray-900 px-3 py-2 rounded-md inline-flex items-center text-sm font-mono'>{children}</div>
		</div>
	);

	const dialogTitleId = 'check-params-dialog-title'; 

	return (
		
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
			
			<div
				ref={dialogRef} // Attach ref for focus management
				role='dialog' // ARIA role for dialog
				aria-modal='true' // Indicates that the dialog blocks content behind it
				aria-labelledby={dialogTitleId} // Links the dialog to its title for screen readers
				tabIndex={-1} // Makes the dialog content focusable
				className='bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl mx-4 relative outline-none' // outline-none removes focus outline
			>
				
				<h2 id={dialogTitleId} className='text-xl font-semibold text-gray-900 mb-6'>
					请检查参数
				</h2>
				<div className='grid grid-cols-2 gap-4 mb-4'>
					<ParameterDisplayRow label='所在链'>
						{parameters.chainIcon}
						<span className='ml-2'>{parameters.chainName}</span>
					</ParameterDisplayRow>
					<ParameterDisplayRow label='是否有效'>
						{parameters.isValid ? '是' : '否'}
					</ParameterDisplayRow>
					<ParameterDisplayRow label='合约标准'>
						{parameters.standard}
					</ParameterDisplayRow>
					<ParameterDisplayRow label='合约地址'>
						{parameters.contractAddress}
					</ParameterDisplayRow>
					<ParameterDisplayRow label='最小延迟'>
						{parameters.minDelay}秒
					</ParameterDisplayRow>
					<ParameterDisplayRow label='管理员'>
						{parameters.admin}
					</ParameterDisplayRow>
					<ParameterDisplayRow label='宽限期'>
						{parameters.gracePeriod}秒
					</ParameterDisplayRow>
					<ParameterDisplayRow label='最小延迟'>
						{parameters.minimumDelay}秒
					</ParameterDisplayRow>
					<ParameterDisplayRow label='最大延迟'>
						{parameters.maximumDelay}秒
					</ParameterDisplayRow>
				</div>

				<div className='mb-4'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>ABI</label>
					<textarea
						readOnly
						aria-label='ABI Content'
						value={abiContent}
						className='
              mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
              focus:outline-none focus:ring-blue-500 focus:border-blue-500
              sm:text-sm bg-gray-100 text-gray-900
            '
						rows={8}
					/>
				</div>

				
				<div className='flex justify-end space-x-3 mt-6'>
					<button onClick={handleCancel} className='bg-white text-gray-900 px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors'>
						取消
					</button>
					<button onClick={handleConfirm} className='bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors cursor-pointer'>
						确认添加
					</button>
				</div>
			</div>
		</div>
	);
};

export default CheckParametersDialog;
