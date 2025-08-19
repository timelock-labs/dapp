'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import AddABIForm from './components/AddABIForm';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';
import { formatDate } from '@/utils/utils';

import ViewABIForm from './components/ViewABIForm';

import StarSVG from '@/components/icons/star';
import EllipsesSVG from '@/components/icons/ellipses';
import ABIRowDropdown from './components/RowDropdown';

import type { ABIRow, ABIContent } from '@/types';
import LoadingSkeleton from './components/LoadingSkeleton';
import PageCard from './components/PageCard';

const ABILibPage: React.FC = () => {
	const t = useTranslations('ABI-Lib');
	const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

	const [isAddABIOpen, setIsAddABIOpen] = useState(false);
	const [isViewABIOpen, setIsViewABIOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [abiToDelete, setAbiToDelete] = useState<ABIRow | null>(null);
	const [abis, setAbis] = useState<ABIRow[]>([]);
	const { data: abiListsRes, request: fetchAbiList, isLoading } = useApi();

	const { request: addAbiReq, data: addAbiRes } = useApi();
	const { request: deleteAbiReq, data: deleteAbiRes } = useApi();
	const { request: validateAbiReq } = useApi();

	const [viewAbiContent, setViewAbiContent] = useState<ABIContent | null>(null);

	const refreshAbiList = useCallback(() => {
		fetchAbiList('/api/v1/abi/list');
	}, [fetchAbiList]);

	useEffect(() => {
		refreshAbiList();
	}, [refreshAbiList]);

	useEffect(() => {
		if (abiListsRes?.success) {
			setAbis(abiListsRes.data.abis);
		} else if (abiListsRes && !abiListsRes.success) {
			toast.error(t('fetchAbiListError', { message: abiListsRes.error?.message || 'Unknown error' }));
		}
	}, [abiListsRes, t]);

	useEffect(() => {
		if (addAbiRes?.success) {
			refreshAbiList();
			setIsAddABIOpen(false);
			toast.success(t('addAbiSuccess'));
		} else if (addAbiRes && !addAbiRes.success) {
			toast.error(t('addAbiError', { message: addAbiRes.error?.message || 'Unknown error' }));
		}
	}, [addAbiRes, refreshAbiList, t]);

	useEffect(() => {
		if (deleteAbiRes?.success) {
			refreshAbiList();
			setIsDeleteDialogOpen(false);
			setAbiToDelete(null);
			toast.success(t('deleteAbiSuccess'));
		} else if (deleteAbiRes && !deleteAbiRes.success) {
			toast.error(t('deleteAbiError', { message: deleteAbiRes.error?.message || 'Unknown error' }));
		}
	}, [deleteAbiRes, refreshAbiList, t]);

	// Remove validation useEffect since it's handled in handleAddABI

	// Effect to handle clicks outside the dropdown
	useEffect(() => {
		if (openDropdownId) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [openDropdownId]);

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setOpenDropdownId(null);
		}
	};

	const handleAddABI = async (name: string, description: string, abi_content: string) => {
		try {
			// First validate the ABI
			const validateResult = await validateAbiReq('/api/v1/abi/validate', { abi_content });

			if (!validateResult?.success || !validateResult.data?.is_valid) {
				toast.error(
					t('validateAbiError', {
						message: validateResult?.error?.message || 'Invalid ABI format',
					})
				);
				return;
			}

			// If validation passes, add the ABI
			await addAbiReq('/api/v1/abi', {
				name,
				description,
				abi_content,
			});
		} catch (error) {
			toast.error(
				t('addAbiError', {
					message: error instanceof Error ? error.message : 'Unknown error',
				})
			);
		}
	};

	const handleViewABI = async (row: ABIRow) => {
		setIsViewABIOpen(true);
		setViewAbiContent(row);
	};

	const handleEllipsisMenu = (rowId: number) => {
		if (openDropdownId === rowId) {
			setOpenDropdownId(null);
		} else {
			setOpenDropdownId(rowId);
		}
	};

	const handleDeleteABI = (row: ABIRow) => {
		setAbiToDelete(row);
		setIsDeleteDialogOpen(true);
		setOpenDropdownId(null);
	};

	const confirmDeleteABI = async () => {
		if (!abiToDelete) return;

		try {
			await deleteAbiReq(`/api/v1/abi/delete`, {
				id: abiToDelete.id,
			});
		} catch (error) {
			// Error handling is done in the useEffect for deleteAbiRes
			console.error('Delete ABI error:', error);
		}
	};

	const cancelDeleteABI = () => {
		setIsDeleteDialogOpen(false);
		setAbiToDelete(null);
	};

	// Define columns for TableComponent
	const columns = [
		{
			key: 'name',
			header: t('abiName'),
			render: (row: ABIRow) => (
				<div className='flex items-center space-x-2 cursor-pointer' onClick={() => handleViewABI(row)}>
					{!row.is_shared && <StarSVG />}
					<span>{row.name}</span>
				</div>
			),
		},
		// { key: "owner", header: t("addressUser") },
		{
			key: 'created_at',
			header: t('addedTime'),
			render: (row: ABIRow) => formatDate(row.created_at),
		},
		{
			key: 'type',
			header: t('abiType'),
			render: (row: ABIRow) => <span>{row.is_shared ? t('platformShared') : t('userImported')}</span>,
		},
		{
			key: 'operations',
			header: t('operations'), // Operations column
			render: (row: ABIRow) => (
				<div className='relative'>
					<button
						ref={(el) => { buttonRefs.current[row.id] = el; }}
						type='button'
						onClick={() => handleEllipsisMenu(row.id)}
						className='text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors'
						aria-label='More options'
						title='More options'>
						<EllipsesSVG />
					</button>
					<ABIRowDropdown
						isOpen={openDropdownId === row.id}
						dropdownRef={dropdownRef}
						onDelete={() => handleDeleteABI(row)}
						onView={() => handleViewABI(row)}
						t={t}
						isShared={row.is_shared}
						buttonRef={buttonRefs.current[row.id] ? { current: buttonRefs.current[row.id]! } : undefined}
					/>
				</div>
			),
		},
	];

	if (isLoading) return <LoadingSkeleton />;

	return (
		<>
			<PageCard abis={abis} columns={columns} setIsAddABIOpen={setIsAddABIOpen} />
			<AddABIForm isOpen={isAddABIOpen} onClose={() => setIsAddABIOpen(false)} onAddABI={handleAddABI} />
			<ViewABIForm
				isOpen={isViewABIOpen}
				onClose={() => setIsViewABIOpen(false)}
				viewAbiContent={viewAbiContent as ABIContent} // Safe cast, ensure not null when opening
			/>
			<ConfirmDialog
				isOpen={isDeleteDialogOpen}
				onClose={cancelDeleteABI}
				onConfirm={confirmDeleteABI}
				title={t('deleteDialog.title')}
				description={t('deleteDialog.description', { name: abiToDelete?.name || '' })}
				confirmText={t('deleteDialog.confirmText')}
				cancelText={t('deleteDialog.cancelText')}
				variant='destructive'
			/>
		</>
	);
};

export default ABILibPage;
