'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import TableComponent from '@/components/ui/TableComponent';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';
import AddABIForm from './components/AddABIForm';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

import ViewABIForm from './components/ViewABIForm';

import StarSVG from '@/components/icons/star';
import EllipsesSVG from '@/components/icons/ellipses';
import AddSVG from '@/components/icons/add';
import ABIRowDropdown from './components/ABIRowDropdown';

import type { ABIRow, ABIContent } from './types/types';
import LoadingSkeleton from './components/LoadingSkeleton';



const ABILibPage: React.FC = () => {
	const t = useTranslations('ABI-Lib');
	const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	const [isAddABIOpen, setIsAddABIOpen] = useState(false);
	const [isViewABIOpen, setIsViewABIOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [abiToDelete, setAbiToDelete] = useState<ABIRow | null>(null);
	const [abis, setAbis] = useState<ABIRow[]>([]);
	const { data: abiListsRes, request: fetchAbiList, error, isLoading } = useApi();

	const { request: addAbi, data: addAbiRes } = useApi();
	const { request: deleteAbi, data: deleteAbiRes } = useApi();
	const { request: validateAbi, data: validateAbiRes } = useApi();

	const [viewAbiContent, setViewAbiContent] = useState<ABIContent | null>(null);

	const refreshAbiList = useCallback(() => {
		fetchAbiList('/api/v1/abi/list');
	}, [fetchAbiList]);

	useEffect(() => {
		refreshAbiList();
	}, [refreshAbiList]);

	useEffect(() => {
		if (abiListsRes?.success) {
			const allAbis = [...(abiListsRes.data.user_abis || []), ...(abiListsRes.data.shared_abis || [])];
			setAbis(allAbis);
			toast.success(t('fetchAbiListSuccess'));
		}

		if (!abiListsRes?.success) {
			toast.error(t('fetchAbiListError', { message: abiListsRes.error?.message || 'Unknown error' }));
		}
	}, [abiListsRes]);

	useEffect(() => {
		if (addAbiRes?.success) {
			refreshAbiList();
			setIsAddABIOpen(false);
			toast.success(t('addAbiSuccess'));
		} else {
			toast.error(t('addAbiError', { message: addAbiRes.error?.message || 'Unknown error' }));
		}

	}, [addAbiRes]);

	useEffect(() => {
		if (deleteAbiRes?.success) {
			refreshAbiList();
			setIsDeleteDialogOpen(false);
			toast.success(t('deleteAbiSuccess'));
		} else {
			toast.error(t('deleteAbiError', { message: deleteAbiRes.error?.message || 'Unknown error' }));
		}
	}, [deleteAbiRes]);

	useEffect(() => {
		const isValid = validateAbiRes?.success && validateAbiRes.data.is_valid;
		isValid ? toast.success(t('validateAbiSuccess')) : toast.error(t('validateAbiError', { message: validateAbiRes.error?.message || 'Unknown error' }));
	}, [validateAbiRes]);

	// Effect to handle clicks outside the dropdown
	useEffect(() => {
		openDropdownId ? document.addEventListener('mousedown', handleClickOutside) : document.removeEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [openDropdownId]);

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setOpenDropdownId(null);
		}
	};

	const handleAddABI = async (name: string, description: string, abi_content: string) => {
		await validateAbi('/api/v1/abi/validate', { abi_content });
		const isValid = validateAbiRes?.success && validateAbiRes.data.is_valid;
		if (!isValid) return;

		await addAbi('/api/v1/abi', {
			name,
			description,
			abi_content,
		});
	}

	const handleViewABI = async (row: ABIRow) => {
		setIsViewABIOpen(true);
		setViewAbiContent(row);
	};

	const handleEllipsisMenu = (rowId: number) => {
		openDropdownId === rowId ?
			setOpenDropdownId(null) :
			setOpenDropdownId(rowId);
	};

	const handleDeleteABI = (row: ABIRow) => {
		setAbiToDelete(row);
		setIsDeleteDialogOpen(true);
		setOpenDropdownId(null);
	};

	const confirmDeleteABI = async () => {
		if (!abiToDelete) return;

		const { success: deleteAbiSuccess, error: deleteAbiError } = await deleteAbi(`/api/v1/abi/delete`, {
			id: abiToDelete.id,
		});

		if (deleteAbiSuccess) {
			toast.success(t('deleteAbiSuccess'));
			refreshAbiList();
			setIsDeleteDialogOpen(false);
			setAbiToDelete(null);
		}

		if (!deleteAbiSuccess) {
			toast.error(
				t('deleteAbiError', {
					message: deleteAbiError?.message || 'Unknown error',
				})
			);
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
				<div className='relative flex items-center space-x-2'>
					<>
						<div className='relative'>
							<button
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
							/>
						</div>
					</>
				</div>
			),
		},
	];

	if (isLoading) return <LoadingSkeleton />

	return (
		<PageLayout title={t('title')}>
			<div className='min-h-screen'>
				<div className='mx-auto border border-gray-200 rounded-lg p-6 '>
					<div className='flex justify-between items-center mb-6'>
						<SectionHeader title={t('storedABI')} description={t('storedABIDescription')} />
						<button
							type='button'
							onClick={() => setIsAddABIOpen(true)}
							className='inline-flex items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'>
							<AddSVG />
							<span>{t('new')}</span>
						</button>
					</div>
					<TableComponent<ABIRow>
						columns={columns}
						data={abis}
						showPagination={false}
						itemsPerPage={5}
					/>
				</div>
			</div>

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
				title='Delete ABI'
				description={`Are you sure you want to delete ABI "${abiToDelete?.name || ''}"? This action cannot be undone.`}
				confirmText='Delete'
				cancelText='Cancel'
				variant='destructive'
			/>
		</PageLayout>
	);
};

export default ABILibPage;
