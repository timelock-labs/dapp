'use client'; // Required for useState and event handlers

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import type { ViewABIFormProps } from '../types/types';

const ViewABIForm: React.FC<ViewABIFormProps> = ({ isOpen, onClose, viewAbiContent }) => {
	const t = useTranslations('ABI-Lib.viewForm');

	if (!isOpen) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='w-[558px] overflow-hidden'>
				<DialogHeader>
					<DialogTitle>{t('title')}</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4 py-4 overflow-hidden'>
					<div className='space-y-2'>
						<Label>{t('nameLabel')}</Label>
						<Input defaultValue={viewAbiContent.name} />
					</div>
					<div className='space-y-2'>
						<Label>{t('descriptionLabel')}</Label>
						<Textarea defaultValue={viewAbiContent.description} />
					</div>
					<div className='space-y-2'>
						<Label>{t('interfaceDetails')}</Label>
						<Textarea className='h-[300px]' defaultValue={JSON.stringify(JSON.parse(viewAbiContent.abi_content), null, 2)} />
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button type='button' variant='outline' onClick={() => onClose()}>
							{t('closeButton')}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ViewABIForm;
