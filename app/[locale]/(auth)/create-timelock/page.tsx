"use client"
import Image from 'next/image';
import React, { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useDeployTimelock } from '@/hooks/useDeployTimelock';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import FirstTimeTimelockIntro from './components/FirstTimeTimelockIntro';
import CreateTimelockForm from './components/CreateTimelockForm';
import ConfirmCreationDialog from './components/ConfirmCreationDialog'; // Import the new dialog component
import PageLayout from "@/components/layout/PageLayout";

const CreateTimelockPage: React.FC = () => {
  // Form States (existing)
  const [selectedChain, setSelectedChain] = useState('timelock'); // Default value for demo
  const [selectedStandard, setSelectedStandard] = useState('compound');
  const [minDelay, setMinDelay] = useState('259200'); // Default value for 3 days (in seconds)
  const [proposers, setProposers] = useState('');
  const [executors, setExecutors] = useState('');
  const [admin, setAdmin] = useState('');
  const [remark] = useState('');

  const { request: createTimelockApiCall } = useApi(); // Rename to avoid conflict
  const accessToken = useAuthStore((state) => state.accessToken);
  const t = useTranslations('Timelocks');

  const { deployCompoundTimelock, deployOpenZeppelinTimelock, isLoading } = useDeployTimelock();

  // State for the Confirm Creation Dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // State to hold the details for the confirmation dialog
  const [dialogDetails, setDialogDetails] = useState({
    chainName: '',
    chainIcon: <Image src="" alt="Chain Logo" width={16} height={16} className="mr-1" />,
    timelockAddress: '',
    initiatingAddress: '', // This would typically come from the connected wallet
    transactionHash: '',
    contractRemarks: '',
  });

  const handleCreate = async () => {
    if (!accessToken) {
      toast.error(t('createTimelockError', { message: 'Please connect your wallet.' }));
      return;
    }

    let deployedContractAddress: string | null = null;
    let transactionHash: string | null = null;

    try {
      console.log(selectedStandard, 'selectedStandard');
      if (selectedStandard === 'compound') {
        const result = await deployCompoundTimelock({
          minDelay: parseInt(minDelay),
          admin: (admin || '0x0000000000000000000000000000000000000000') as `0x${string}`,
        });
        deployedContractAddress = result.contractAddress;
        transactionHash = result.transactionHash;
      } else if (selectedStandard === 'openzeppelin') {
        const result = await deployOpenZeppelinTimelock({
          minDelay: parseInt(minDelay),
          proposers: proposers.split(',').map(addr => addr.trim()).filter(addr => addr !== '') as `0x${string}`[],
          executors: executors.split(',').map(addr => addr.trim()).filter(addr => addr !== '') as `0x${string}`[],
          admin: (admin || '0x0000000000000000000000000000000000000000') as `0x${string}`,
        });
        deployedContractAddress = result.contractAddress;
        transactionHash = result.transactionHash;
      }

      if (deployedContractAddress && transactionHash) {
        setDialogDetails({
          chainName: selectedChain, // You might want to map chain_id to chain_name properly
          chainIcon: <Image src="" alt="Chain Logo" width={16} height={16} className="mr-1" />, // Placeholder
          timelockAddress: deployedContractAddress,
          initiatingAddress: '0xYourWalletAddressHere', // Replace with actual connected wallet address
          transactionHash: transactionHash,
          contractRemarks: remark, // Use the remark from the form
        });
        setIsConfirmDialogOpen(true);
      }
    } catch (error) {
      console.error("Deployment failed:", error);
      // The useDeployTimelock hook already handles toast messages for errors.
    }
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleConfirmDialogConfirm = async () => {
    // This function is called when the user clicks "确认添加" in the dialog.
    // Now, call the backend API to record the Timelock.

    if (!accessToken) {
      toast.error(t('createTimelockError'), { description: 'Please connect your wallet.' });
      return;
    }

    const body: Record<string, unknown> = {
      chain_id: parseInt(selectedChain),
      chain_name: dialogDetails.chainName, // Use chain name from dialog details
      min_delay: parseInt(minDelay),
      remark: dialogDetails.contractRemarks, // Use remark from dialog details
      standard: selectedStandard,
      tx_hash: dialogDetails.transactionHash, // Use actual txHash from dialog details
      contract_address: dialogDetails.timelockAddress, // Use actual contract address from dialog details
    };

    if (selectedStandard === 'compound') {
      body.admin = admin;
    } else if (selectedStandard === 'openzeppelin') {
      body.proposers = proposers.split(',').map(addr => addr.trim());
      body.executors = executors.split(',').map(addr => addr.trim());
      body.cancellers = proposers.split(',').map(addr => addr.trim());
      body.admin = admin;
    }

    const { data: apiResponse, error: apiError } = await createTimelockApiCall('/api/v1/timelock/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (apiResponse && apiResponse.success) {
      toast.success(t('createTimelockSuccess'));
      // Optionally, redirect or update UI after successful API call
      // router.push('/home'); // Example redirect
    } else {
      console.error('API Error:', apiError || apiResponse?.error?.message);
      toast.error(t('createTimelockError'), { description: apiError?.message || apiResponse?.error?.message || 'Unknown error' });
    }

    setIsConfirmDialogOpen(false); // Close dialog after API call
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
              onDeploy={handleCreate}
              isLoading={isLoading}
            />
        </div>

        {/* Confirmation Dialog (rendered conditionally) */}
        <ConfirmCreationDialog
          isOpen={isConfirmDialogOpen}
          onClose={handleConfirmDialogClose}
          onConfirm={handleConfirmDialogConfirm}
          creationDetails={dialogDetails}
        />
        </div>
    </PageLayout>
  );
};

export default CreateTimelockPage;