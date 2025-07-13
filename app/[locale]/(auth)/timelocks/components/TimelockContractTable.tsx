"use client"
import React, { useState, useEffect, useRef } from 'react';
import TableComponent from '@/components/ui/TableComponent';
import SectionHeader from '@/components/ui/SectionHeader';
import { useRouter, useParams } from 'next/navigation';
import { formatAddress, formatDate } from '@/lib/utils';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';

// Define the interface for a single Timelock contract based on the API response
interface TimelockContract {
    id: number;
    chain_name: string;
    contract_address: string;
    admin: string;
    created_at: string;
    remark: string;
    status: string;
    // Include other fields from the API that might be needed
}

// Define the props for the component, which now includes the 'data' prop
interface TimelockContractTableProps {
    data: TimelockContract[];
    onDataUpdate?: () => void;
}

const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active':
            return 'bg-green-100 text-green-800 border border-green-200';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        default:
            return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
};

const TimelockContractTable: React.FC<TimelockContractTableProps> = ({ data, onDataUpdate }) => {
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [contractToDelete, setContractToDelete] = useState<TimelockContract | null>(null);

    const router = useRouter();
    const params = useParams();
    const locale = params.locale;
    const accessToken = useAuthStore((state) => state.accessToken);

    const { data: deleteResponse, request: deleteContract } = useApi();

    const handleImportContract = () => {
        router.push(`/${locale}/import-timelock`);
    };

    const handleCreateContract = () => {
        router.push(`/${locale}/create-timelock`);
    };

    const handleEllipsisMenu = (rowId: number) => {
        setOpenDropdownId(openDropdownId === rowId ? null : rowId);
    };

    const handleDeleteClick = (row: TimelockContract) => {
        setContractToDelete(row);
        setIsDeleteDialogOpen(true);
        setOpenDropdownId(null);
    };

    const confirmDeleteContract = async () => {
        if (!contractToDelete) return;
        
        await deleteContract(`/api/v1/timelock/${contractToDelete.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        
        setIsDeleteDialogOpen(false);
        setContractToDelete(null);
    };

    const cancelDeleteContract = () => {
        setIsDeleteDialogOpen(false);
        setContractToDelete(null);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };

        if (openDropdownId !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdownId]);

    useEffect(() => {
        if (deleteResponse?.success === true) {
            toast.success('Contract deleted successfully');
            if (onDataUpdate) {
                onDataUpdate();
            }
        } else if (deleteResponse?.success === false && deleteResponse.data !== null) {
            console.error('Failed to delete contract:', deleteResponse.error);
            toast.error(`Failed to delete contract: ${deleteResponse.error?.message || 'Unknown error'}`);
        }
    }, [deleteResponse, onDataUpdate]);

    const columns = [
        {
            key: 'chain',
            header: 'Chain',
            render: (row: TimelockContract) => (
                <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                    {/* Placeholder for chain icon */}
                    <span className="text-gray-700 text-base">♦️</span>
                    <span className="text-gray-800 font-medium">{row.chain_name}</span>
                </div>
            ),
        },
        {
            key: 'name',
            header: 'Name',
            render: (row: TimelockContract) => (
                 <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(row.status)}`}>
                    {row.remark}
                </span>
            ),
        },
        { 
            key: 'contract_address', 
            header: 'Timelock', 
        },
        { 
            key: 'admin', 
            header: 'Owner', 
        },
        { 
            key: 'created_at', 
            header: 'Added At', 
            render: (row: TimelockContract) => formatDate(row.created_at) 
        },
        {
            key: 'operations',
            header: 'Operations',
            render: (row: TimelockContract) => (
                <div className="relative flex items-center space-x-2">
                    <div className="relative">
                        <button 
                            type="button"
                            onClick={() => handleEllipsisMenu(row.id)} 
                            className="text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors"
                            aria-label="More options"
                            title="More options"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                        </button>
                        {openDropdownId === row.id && (
                            <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteClick(row)}
                                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-gray-100 hover:text-red-700 flex items-center space-x-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white">
            <div className="mx-auto">
                <div className="flex items-center mb-6">
                    <div className="flex-grow">
                        <SectionHeader
                            title="Timelock Contracts"
                            description="Manage your existing Timelock contracts."
                        />
                    </div>
                    <div className="flex transform -translate-y-2.5">
                        <button
                            type="button"
                            onClick={handleImportContract}
                            className="bg-white text-gray-900 px-4 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors text-sm"
                        >
                            Import Existing Contract
                        </button>
                        <button 
                            type="button"
                            onClick={handleCreateContract} 
                            className="ml-2.5 bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors text-sm"
                        >
                            Create New Contract
                        </button>
                    </div>
                </div>
                <TableComponent<TimelockContract> columns={columns} data={data} showPagination={true} itemsPerPage={5} />
            </div>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={cancelDeleteContract}
                onConfirm={confirmDeleteContract}
                title="Delete Timelock Contract"
                description={`Are you sure you want to delete the timelock contract "${contractToDelete?.remark || 'Unknown'}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
};

export default TimelockContractTable;