'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ABITextarea from '@/components/ui/ABITextarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import type { AddABIFormProps } from '@/types';

/**
 * Add ABI form component for creating new ABI entries
 *
 * @param props - AddABIForm component props
 * @returns JSX.Element
 */
const AddABIForm: React.FC<AddABIFormProps> = ({ isOpen, onClose, onAddABI }) => {
	const t = useTranslations('Transactions.AddABIForm');
	const [name, setName] = useState<string>('');
	const [abi, setAbi] = useState<string>('');

	const handleCancel = () => {
		setName(''); // Reset form fields
		setAbi('');
		onClose(); // Close the dialog
	};

	const handleSave = () => {
		// Here you would typically send data to a backend or update global state
		if (name.trim() && abi.trim()) {
			onAddABI(name, '', abi);
			setName('');
			setAbi('');
			onClose(); // Close the dialog after saving
		}
	};

	if (!isOpen) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='w-[558px] h-[470px]'>
				{' '}
				{/* Adjusted width slightly */}
				<DialogHeader>
					<DialogTitle>{t('title')}</DialogTitle>
					<DialogDescription>{t('description')}</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					{/* Name Input Field - Vertical Layout */}
					<div className='space-y-2'>
						<Label htmlFor='abiName'>{t('nameLabel')}</Label>
						<Input id='abiName' value={name} onChange={e => setName(e.target.value)} placeholder={t('nameLabel')} />
					</div>
					<ABITextarea id='abiContent' label={t('contentLabel')} value={abi} onChange={setAbi} placeholder={t('contentLabel')} rows={8} />
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button type='button' variant='outline' onClick={handleCancel}>
							{t('cancelButton')}
						</Button>
					</DialogClose>
					<Button type='button' onClick={handleSave}>
						{t('addButton')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddABIForm;
