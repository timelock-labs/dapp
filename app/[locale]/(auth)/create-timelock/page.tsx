"use client"
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import FirstTimeTimelockIntro from './components/FirstTimeTimelockIntro';
import CreateTimelockForm from './components/CreateTimelockForm';
import ConfirmCreationDialog from './components/ConfirmCreationDialog'; // Import the new dialog component
import PageLayout from "@/components/layout/PageLayout";

const CreateTimelockPage: React.FC = () => {
  // Form States (existing)
  const [selectedChain, setSelectedChain] = useState('timelock'); // Default value for demo
  const [selectedStandard, setSelectedStandard] = useState('compound');
  const [minDelay, setMinDelay] = useState('3600'); // Default value for demo
  const [proposers, setProposers] = useState('');
  const [executors, setExecutors] = useState('');
  const [admin, setAdmin] = useState('');

  // State for the Confirm Creation Dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Dummy data for the dialog (replace with actual form data in a real app)
  const dialogCreationDetails = useRef({
    chainName: 'Arbitrum',
    chainIcon: <Image src="" alt="Arbitrum Logo" width={16} height={16} className="mr-1" />,
    timelockAddress: '0x73823131a6778210D075140A57cfFAb1421B1a40',
    initiatingAddress: '0x73823131a6778210D075140A57cfFAb141B1a40',
    transactionHash: '0x73823131a6778210D075140A57cfFAb1421B1a40',
    contractRemarks: '这是合同的备注', // This will be the read-only remark in the dialog
  }).current;

  const handleCreate = () => {
    // In a real app, you would gather data from `selectedChain`, `selectedStandard`, `minDelay`
    // and potentially other form fields to populate `dialogCreationDetails`.
    // For now, we'll just use the dummy data set above.

    // Open the confirmation dialog
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleConfirmDialogConfirm = () => {
    // This is where the actual 'create' action would be finalized after confirmation
    alert('确认添加 (Confirm Add) clicked in dialog! Proceeding with creation...');
    console.log('Final creation details:', dialogCreationDetails);
    console.log('Form inputs at time of creation:', { selectedChain, selectedStandard, minDelay });
    setIsConfirmDialogOpen(false); // Close dialog
  };

  return (
    <PageLayout title="创建Timelock">
        <div className=" bg-white p-8">
        <div className="mx-auto flex flex-col space-y-8">
            {/* Top Info Section */}
            <FirstTimeTimelockIntro />

            {/* Main Form Area */}
            <CreateTimelockForm
              selectedChain={selectedChain}
              onChainChange={setSelectedChain}
              selectedStandard={selectedStandard}
              onStandardChange={setSelectedStandard}
              minDelay={minDelay}
              onMinDelayChange={setMinDelay}
              proposers={proposers}
              onProposersChange={setProposers}
              executors={executors}
              onExecutorsChange={setExecutors}
              admin={admin}
              onAdminChange={setAdmin}
            />

            {/* Create Button (Bottom Right) */}
            <div className="flex justify-end mt-4">
            <button
                onClick={handleCreate}
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
                创建
            </button>
            </div>
        </div>

        {/* Confirmation Dialog (rendered conditionally) */}
        <ConfirmCreationDialog
            isOpen={isConfirmDialogOpen}
            onClose={handleConfirmDialogClose}
            onConfirm={handleConfirmDialogConfirm}
            creationDetails={dialogCreationDetails}
        />
        </div>
    </PageLayout>
  );
};

export default CreateTimelockPage;