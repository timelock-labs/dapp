'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Assuming SectionHeader is in components/ui/
import TableComponent from '@/components/ui/TableComponent'; // Assuming TableComponent is in components/
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';
import AddABIForm from './components/AddABIForm'; // Import the new form component
import ConfirmDialog from '@/components/ui/ConfirmDialog'; // Import the confirm dialog
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

import ViewABIForm from './components/ViewABIForm'; // Import the view ABI form component

import StarSVG from '@/components/icons/star'; // Import the star icon
import EllipsesSVG from '@/components/icons/ellipses'; // Import the ellipses icon
import AddSVG from '@/components/icons/add'; // Import the add icon
import ABIRowDropdown from './components/ABIRowDropdown';

import type { ABIRow, ABIContent } from './components/types';

const ABILibPage: React.FC = () => {
	const t = useTranslations('ABI-Lib');
	const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	const [isAddABIOpen, setIsAddABIOpen] = useState(false);
	const [isViewABIOpen, setIsViewABIOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [abiToDelete, setAbiToDelete] = useState<ABIRow | null>(null);
	const [abis, setAbis] = useState<ABIRow[]>([]);
	const { data: abiListResponse, request: fetchAbiList, error, isLoading } = useApi();
	const { request: addAbi } = useApi();
	const { data: deleteAbiResponse, request: deleteAbi } = useApi();
	const { data: viewAbiResponse } = useApi();
	const { request: validateAbi } = useApi();

	const [viewAbiContent, setViewAbiContent] = useState<ABIContent | null>(null);

	const refreshAbiList = useCallback(() => {
		fetchAbiList('/api/v1/abi/list', {
			method: 'GET',
		});
	}, [fetchAbiList]);

	useEffect(() => {
		refreshAbiList();
	}, [refreshAbiList]); // 添加 refreshAbiList 到依赖数组

	useEffect(() => {
		if (abiListResponse?.success === true) {
			const allAbis = [
				...(abiListResponse.data.user_abis || []),
				...(abiListResponse.data.shared_abis || []),
			];
			setAbis(allAbis);
			// 移除成功通知，避免页面加载时显示
		} else if (abiListResponse?.success === false && abiListResponse.data !== null) {
			console.error('Failed to fetch ABI list:', abiListResponse.error);
			toast.error(
				t('fetchAbiListError', {
					message: abiListResponse.error?.message || 'Unknown error',
				})
			);
		}
	}, [abiListResponse, t]);

	useEffect(() => {
		if (error) {
			console.error('API Error:', error);
		}
	}, [error]);

	const handleAddABI = async (name: string, description: string, abi_content: string) => {
		try {
			const validationResponse = await validateAbi('/api/v1/abi/validate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					abi_content,
				},
			});

			if (validationResponse?.success && validationResponse.data.is_valid) {
				const addResponse = await addAbi('/api/v1/abi', {
					method: 'POST',
					body: {
						name,
						description,
						abi_content,
					},
				});

				if (addResponse?.success) {
					toast.success(t('addAbiSuccess'));
					refreshAbiList(); // 刷新列表
					setIsAddABIOpen(false);
				} else {
					toast.error(
						t('addAbiError', {
							message: addResponse?.error?.message || 'Unknown error',
						})
					);
				}
			} else {
				const errorMessage =
					validationResponse?.error?.message ||
					validationResponse?.data?.error_message ||
					'Unknown validation error';
				console.error('ABI validation failed:', errorMessage);
				toast.error(t('validateAbiError', { message: errorMessage }));
			}
		} catch (error: unknown) {
			console.error('Error in handleAddABI:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			toast.error(t('addAbiError', { message: errorMessage }));
		}
	};

	const handleViewABI = async (row: ABIRow) => {
		setIsViewABIOpen(true);
		setViewAbiContent(row);
	};

	useEffect(() => {
		if (viewAbiResponse?.success === true) {
			console.log(`ABI Content for ${viewAbiResponse.data.name}:
${viewAbiResponse.data.abi_content}`);
			toast.success(t('viewAbiSuccess', { name: viewAbiResponse.data.name }));
		} else if (viewAbiResponse?.success === false && viewAbiResponse.data !== null) {
			console.error('Failed to fetch ABI details:', viewAbiResponse.error);
			toast.error(
				t('viewAbiError', { message: viewAbiResponse.error?.message || 'Unknown error' })
			);
		}
	}, [viewAbiResponse, t]);

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

		await deleteAbi(`/api/v1/abi/${abiToDelete.id}`, {
			method: 'DELETE',
		});

		setIsDeleteDialogOpen(false);
		setAbiToDelete(null);
	};

	const cancelDeleteABI = () => {
		setIsDeleteDialogOpen(false);
		setAbiToDelete(null);
	};

	useEffect(() => {
		if (deleteAbiResponse?.success === true) {
			console.log(`ABI deleted successfully.`);
			toast.success(t('deleteAbiSuccess'));
			refreshAbiList(); // 刷新列表
		} else if (deleteAbiResponse?.success === false && deleteAbiResponse.data !== null) {
			console.error('Failed to delete ABI:', deleteAbiResponse.error);
			toast.error(
				t('deleteAbiError', {
					message: deleteAbiResponse.error?.message || 'Unknown error',
				})
			);
		}
	}, [deleteAbiResponse, t, refreshAbiList]);

	// Effect to handle clicks outside the dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setOpenDropdownId(null);
			}
		};

		if (openDropdownId) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [openDropdownId]);

	// Define columns for TableComponent
	const columns = [
		{
			key: 'name',
			header: t('abiName'),
			render: (row: ABIRow) => (
				<div
					className='flex items-center space-x-2 cursor-pointer'
					onClick={() => handleViewABI(row)}>
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
			render: (row: ABIRow) => (
				<span>{row.is_shared ? t('platformShared') : t('userImported')}</span>
			),
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

	// Show loading skeleton while data is being fetched
	if (isLoading) {
		return (
			<PageLayout title={t('title')}>
				<div className='min-h-screen'>
					<div className='mx-auto border border-gray-200 rounded-lg p-6'>
						{/* Header skeleton */}
						<div className='flex items-center justify-between mb-6'>
							<div className='space-y-2'>
								<div className='h-6 w-32 bg-gray-200 rounded animate-pulse'></div>
								<div className='h-4 w-80 bg-gray-200 rounded animate-pulse'></div>
							</div>
							<div className='h-10 w-20 bg-gray-200 rounded animate-pulse'></div>
						</div>

						{/* Table skeleton */}
						<div className='border border-gray-200 rounded-lg overflow-hidden'>
							{/* Table header */}
							<div className='bg-gray-50 border-b border-gray-200 px-6 py-3'>
								<div className='flex space-x-4'>
									<div className='h-4 w-24 bg-gray-200 rounded animate-pulse flex-1'></div>
									<div className='h-4 w-20 bg-gray-200 rounded animate-pulse flex-1'></div>
									<div className='h-4 w-16 bg-gray-200 rounded animate-pulse flex-1'></div>
									<div className='h-4 w-16 bg-gray-200 rounded animate-pulse flex-1'></div>
								</div>
							</div>

							{/* Table rows */}
							{Array.from({ length: 5 }).map((_, rowIndex) => (
								<div
									key={rowIndex}
									className='border-b border-gray-200 px-6 py-4 last:border-b-0'>
									<div className='flex space-x-4'>
										<div className='flex-1'>
											<div className='flex items-center space-x-2'>
												<div className='h-4 w-4 bg-gray-200 rounded animate-pulse'></div>
												<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
											</div>
										</div>
										<div className='flex-1'>
											<div className='h-4 w-24 bg-gray-200 rounded animate-pulse'></div>
										</div>
										<div className='flex-1'>
											<div className='h-6 w-20 bg-gray-200 rounded-full animate-pulse'></div>
										</div>
										<div className='flex-1'>
											<div className='h-8 w-8 bg-gray-200 rounded animate-pulse'></div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</PageLayout>
		);
	}

	return (
		<PageLayout title={t('title')}>
			<div className='min-h-screen  '>
				<div className='mx-auto border border-gray-200 rounded-lg p-6 '>
					<div className='flex justify-between items-center mb-6'>
						<SectionHeader
							title={t('storedABI')}
							description={t('storedABIDescription')}
						/>
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
						showPagination={false} // Image does not show pagination for this table
						itemsPerPage={5} // Max 5 items visible in image
					/>
				</div>
			</div>

			<AddABIForm
				isOpen={isAddABIOpen}
				onClose={() => setIsAddABIOpen(false)}
				onAddABI={handleAddABI}
			/>
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
				description={`Are you sure you want to delete ABI "${
					abiToDelete?.name || ''
				}"? This action cannot be undone.`}
				confirmText='Delete'
				cancelText='Cancel'
				variant='destructive'
			/>
		</PageLayout>
	);
};

export default ABILibPage;
