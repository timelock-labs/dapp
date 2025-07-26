"use client"
import React, { useState, useEffect, useRef } from 'react';
import TableComponent from '@/components/ui/TableComponent';
import SectionHeader from '@/components/ui/SectionHeader';
import { useRouter, useParams } from 'next/navigation';
import { formatAddress, formatDate } from '@/lib/utils';
import DeleteButton from '@/components/ui/DeleteButton';
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
    standard?: string;
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

    const handleDeleteContract = async (contract: TimelockContract) => {
        const standard = contract.standard || 'compound'; // 默认使用 compound 标准
        await deleteContract(`/api/v1/timelock/${standard}/${contract.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
    };

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
                <div className="flex items-center justify-center">
                    <DeleteButton
                        onDelete={() => handleDeleteContract(row)}
                        title="Delete Timelock Contract"
                        description={`Are you sure you want to delete the timelock contract "${row.remark || 'Unknown'}"? This action cannot be undone.`}
                        confirmText="Delete"
                        cancelText="Cancel"
                        variant="destructive"
                        size="sm"
                    />
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
                            className="bg-white text-gray-900 px-4 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors text-sm cursor-pointer"
                        >
                            Import Existing Contract
                        </button>
                        <button 
                            type="button"
                            onClick={handleCreateContract} 
                            className="ml-2.5 bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors text-sm cursor-pointer"
                        >
                            Create New Contract
                        </button>
                    </div>
                </div>
                <TableComponent<TimelockContract> columns={columns} data={data} showPagination={true} itemsPerPage={5} />
            </div>
        </div>
    );
};

export default TimelockContractTable;