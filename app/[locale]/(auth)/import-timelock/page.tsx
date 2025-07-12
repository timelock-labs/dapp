"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Assuming path
import TextInput from '@/components/ui/TextInput';       // Assuming path
import SelectInput from '@/components/ui/SelectInput';   // Assuming path
import CheckParametersModal from './components/CheckParametersModal'
import QuestionIcon from '@/public/QuestionIcon.svg'
import PageLayout from "@/components/layout/PageLayout";
import { useAuthStore } from '@/store/userStore';
import { useTimelockImport, TimelockParameters } from '@/hooks/useTimelockImport';
import { useTimelockApi } from '@/hooks/useTimelockApi';
import { ChainUtils } from '@/utils/chainUtils';
import { toast } from 'sonner';

const ImportTimelockPage: React.FC = () => {
    // State for form fields
    const [selectedChain, setSelectedChain] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [contractStandard, setContractStandard] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detectedParameters, setDetectedParameters] = useState<TimelockParameters | null>(null);
    
    // Get chains from store
    const { chains, fetchChains } = useAuthStore();
    
    // Import hooks
    const { 
        isLoading: isDetecting, 
        parameters, 
        fetchTimelockParameters, 
        validateContractAddress,
        clearParameters 
    } = useTimelockImport();
    
    const { importTimelock } = useTimelockApi();

    // Fetch chains on component mount
    useEffect(() => {
        if (chains.length === 0) {
            fetchChains();
        }
    }, [chains, fetchChains]);

    // Update detected parameters when they change
    useEffect(() => {
        if (parameters && parameters.isValid) {
            setDetectedParameters(parameters);
            setContractStandard(parameters.standard || '');
        }
    }, [parameters]);

    // Convert chains to options format
    const chainOptions = chains.map(chain => ({
        value: chain.chain_id.toString(),
        label: chain.chain_name,
    }));
    
    const standardOptions = [
        { value: 'compound', label: 'Compound' },
        { value: 'openzeppelin', label: 'OpenZeppelin' },
    ];

    // Handle contract address change (remove auto-detection)
    const handleContractAddressChange = (address: string) => {
        setContractAddress(address);
        // Clear any previous detection results when address changes
        if (detectedParameters) {
            setDetectedParameters(null);
            setContractStandard('');
            clearParameters();
        }
    };

    const handleNextStep = async () => {
        // Validation
        if (!selectedChain) {
            toast.error('Please select a chain');
            return;
        }
        
        if (!contractAddress) {
            toast.error('Please enter contract address');
            return;
        }
        
        if (!contractStandard) {
            toast.error('Please select contract standard');
            return;
        }

        // Start detection process
        try {
            // First validate the contract address
            const isValid = await validateContractAddress(contractAddress);
            if (!isValid) {
                toast.error('Invalid contract address or not a contract');
                return;
            }

            // Detect timelock parameters from blockchain
            const detectedParams = await fetchTimelockParameters(contractAddress);
            
            if (!detectedParams.isValid) {
                toast.error('Failed to detect valid timelock parameters');
                return;
            }

            // Verify the detected standard matches user selection
            if (detectedParams.standard !== contractStandard) {
                toast.error(`Detected standard (${detectedParams.standard}) doesn't match selected standard (${contractStandard})`);
                return;
            }

            // If detection successful, open confirmation modal
            setDetectedParameters(detectedParams);
            setIsModalOpen(true);

        } catch (error) {
            console.error('Detection failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Detection failed';
            toast.error(errorMessage);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmParams = async (abiContent?: string) => {
        if (!detectedParameters || !detectedParameters.isValid) {
            toast.error('Invalid timelock parameters');
            return;
        }

        try {
            const chainId = parseInt(selectedChain);
            const chainName = ChainUtils.getChainName(chains, chainId);
            
            const importData = {
                chain_id: chainId,
                chain_name: chainName,
                contract_address: contractAddress,
                standard: detectedParameters.standard!,
                min_delay: detectedParameters.minDelay,
                remark: remarks || 'Imported Timelock',
            };

            // Add standard-specific parameters
            if (detectedParameters.standard === 'compound') {
                Object.assign(importData, {
                    admin: detectedParameters.admin,
                    pending_admin: detectedParameters.pendingAdmin || '',
                });
            } else if (detectedParameters.standard === 'openzeppelin') {
                Object.assign(importData, {
                    proposers: detectedParameters.proposers || [],
                    executors: detectedParameters.executors || [],
                    cancellers: detectedParameters.cancellers || [],
                });
            }

            const response = await importTimelock(importData);
            
            if (response.success) {
                toast.success('Timelock imported successfully!');
                // Reset form
                setSelectedChain('');
                setContractAddress('');
                setContractStandard('');
                setRemarks('');
                setDetectedParameters(null);
                clearParameters();
                handleCloseModal();
            } else {
                throw new Error(response.error?.message || 'Failed to import timelock');
            }
        } catch (error) {
            console.error('Import failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            toast.error(`Import failed: ${errorMessage}`);
        }
    };

    return (
        <PageLayout title="Timelock">
            <div className=" bg-white p-8 flex flex-col "> {/* Outer container, flex-col to push button */}
                <div className="flex-grow bg-white"> {/* Inner card-like container */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-b border-gray-200"> {/* 1:1 Left-Right Layout */}
                        {/* Left Column: Header with Question Mark Icon */}
                        <div className="flex flex-col pr-8"> {/* Add padding-right to separate from right column */}
                            <SectionHeader
                                title="导入Timelock"
                                description="View and update your personal details and account information."
                                icon={<Image src={QuestionIcon} alt="Question Icon" width={15} height={15} />}
                            />
                            {/* Additional content for left column if any */}
                        </div>

                        {/* Right Column: Form Fields */}
                        <div className="flex flex-col pl-8"> {/* Add padding-left to separate from left column */}
                            <SelectInput
                                label="选择所在链"
                                value={selectedChain}
                                onChange={setSelectedChain}
                                options={chainOptions}
                                placeholder="选择所在链"
                            />
                            <TextInput
                                label="合约地址"
                                value={contractAddress}
                                onChange={handleContractAddressChange}
                                placeholder="0x..."
                            />
                            <SelectInput
                                label="合约标准"
                                value={contractStandard}
                                onChange={setContractStandard}
                                options={standardOptions}
                                placeholder="Select Standard"
                            />
                            <TextInput
                                label="备注"
                                value={remarks}
                                onChange={setRemarks}
                                placeholder="Target"
                            />
                        </div>
                    </div>
                    {/* Button at Bottom Right */}
                    <div className="mx-auto flex justify-end mt-8"> {/* mx-auto and justify-end to align with main content */}
                        <button
                            type="button"
                            onClick={handleNextStep}
                            disabled={isDetecting || !selectedChain || !contractAddress || !contractStandard}
                            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isDetecting ? '检测中...' : '下一步'}
                        </button>
                    </div>
                </div>

            

                <CheckParametersModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmParams}
                    parameters={{
                        chainName: ChainUtils.getChainName(chains, selectedChain),
                        chainIcon: '',
                        remarks: remarks || 'Imported Timelock',
                        timelockAddress: contractAddress,
                        abiPlaceholder: detectedParameters ? JSON.stringify(detectedParameters, null, 2) : '',
                    }}
                />
            </div>
        </PageLayout>
    );
};

export default ImportTimelockPage;
