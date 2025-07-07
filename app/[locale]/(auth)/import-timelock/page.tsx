"use client"
import Image from 'next/image';
import React, { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Assuming path
import TextInput from '@/components/ui/TextInput';       // Assuming path
import SelectInput from '@/components/ui/SelectInput';   // Assuming path
import CheckParametersModal from './components/CheckParametersModal'
import QuestionIcon from '@/public/QuestionIcon.svg'
import PageLayout from "@/components/layout/PageLayout";

const ImportTimelockPage: React.FC = () => {
    // State for form fields
    const [selectedChain, setSelectedChain] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [contractStandard, setContractStandard] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmedAbi, setConfirmedAbi] = useState<string | null>(null);
    
    // Dummy options for select inputs
    const chainOptions = [
        { value: 'timelock_chain', label: 'Timelock' }, // As in the image
        { value: 'ethereum', label: 'Ethereum' },
        { value: 'bsc', label: 'BSC' },
    ];
    const standardOptions = [
        { value: 'timelock_standard', label: 'Timelock' }, // As in the image
        { value: 'erc20', label: 'ERC-20' },
        { value: 'erc721', label: 'ERC-721' },
    ];

    // Dummy data to pass to the modal
    const dummyParameters = {
        chainName: 'Arbitrum',
        chainIcon: <Image src="https://assets.arbitrum.io/logo.png" alt="Arbitrum Logo" width={16} height={16} className="mr-1" />,
        remarks: 'Uniswap 金库合约',
        timelockAddress: '0x73823131a6778210D075140A57cfFAb1421B1a40',
        abiPlaceholder: 'Placeholder for ABI content...',
    };

    const handleNextStep = () => {
        console.log('Next Step button clicked!');
        console.log({
            selectedChain,
            contractAddress,
            contractStandard,
            remarks,
        });
        // Implement logic for proceeding to the next step, e.g., validation, API call, navigation
        setIsModalOpen(true); // Open the SecurityFeatureCard
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmParams = (abiContent: string) => {
        console.log(confirmedAbi);
        setConfirmedAbi(abiContent);
        alert(`Parameters confirmed!\nABI Content:\n${abiContent}`);
        handleCloseModal(); // Close modal after confirmation
    };

    return (
        <PageLayout title="导入Timelock">
            <div className=" bg-white p-8 flex flex-col "> {/* Outer container, flex-col to push button */}
                <div className="mx-auto flex-grow bg-white p-8   "> {/* Inner card-like container */}
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
                                placeholder="Timelock"
                            />
                            <TextInput
                                label="合约地址"
                                value={contractAddress}
                                onChange={setContractAddress}
                                placeholder="Target"
                            />
                            <SelectInput
                                label="合约标准"
                                value={contractStandard}
                                onChange={setContractStandard}
                                options={standardOptions}
                                placeholder="Timelock"
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
                            onClick={handleNextStep}
                            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                        >
                            下一步
                        </button>
                    </div>
                </div>

            

                <CheckParametersModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmParams}
                    parameters={dummyParameters}
                />
            </div>
        </PageLayout>
    );
};

export default ImportTimelockPage;
