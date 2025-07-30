"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useDeployTimelock } from '@/hooks/useDeployTimelock';
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain  } from 'thirdweb/react';
import { useRouter, useParams } from 'next/navigation';
import FirstTimeTimelockIntro from './components/FirstTimeTimelockIntro';
import CreateTimelockForm from './components/CreateTimelockForm';
import ConfirmCreationDialog from './components/ConfirmCreationDialog'; // Import the new dialog component
import PageLayout from "@/components/layout/PageLayout";
import { getChainObject } from '@/utils/chainUtils';


const CreateTimelockPage: React.FC = () => {
  // Form States (existing)
  const [selectedChain, setSelectedChain] = useState<number>(1); // Default value for demo
  const [selectedStandard, setSelectedStandard] = useState('compound');
  const [minDelay, setMinDelay] = useState('259200'); // Default value for 3 days (in seconds)
  const [proposers, setProposers] = useState('');
  const [executors, setExecutors] = useState('');
  const [admin, setAdmin] = useState('');

  const { id: chainId } = useActiveWalletChain() || {};
  const switchChain = useSwitchActiveWalletChain()

  const { request: createTimelockApiCall } = useApi();
  const { accessToken, chains } = useAuthStore();
  const { address: walletAddress } = useActiveAccount() || {};

  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const { deployCompoundTimelock, deployOpenZeppelinTimelock, isLoading } = useDeployTimelock();

  // State for the Confirm Creation Dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // State to hold the details for the confirmation dialog
  const [dialogDetails, setDialogDetails] = useState({
    chainName: '',
    chainIcon: <Image src="" alt="Chain Logo" width={16} height={16} className="mr-1" />,
    timelockAddress: '',
    initiatingAddress: '',
    transactionHash: '',
  });

  // useEffect(() => {
  //   if (!accessToken || !walletAddress) {
  //     toast.error('Please connect your wallet first.');
  //     return;
  //   }
  // }, [ChainId]);

  const handleCreate = async () => {
    if (!accessToken || !walletAddress) {
      toast.error('Please connect your wallet first.');
      return;
    }

    // Validation
    if (!selectedChain || !minDelay) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (selectedStandard === 'openzeppelin' && (!proposers.trim() || !executors.trim())) {
      toast.error('Proposers and Executors are required for OpenZeppelin standard.');
      return;
    }

    let deployedContractAddress: string | null = null;
    let transactionHash: string | null = null;

    try {
      console.log('Deploying timelock with standard:', selectedStandard);

      if (selectedStandard === 'compound') {
        const result = await deployCompoundTimelock({
          minDelay: parseInt(minDelay),
          admin: (admin.trim() || walletAddress) as `0x${string}`,
        });
        deployedContractAddress = result.contractAddress;
        transactionHash = result.transactionHash;
      } else if (selectedStandard === 'openzeppelin') {
        const proposersList = proposers.split(',').map(addr => addr.trim()).filter(addr => addr !== '') as `0x${string}`[];
        const executorsList = executors.split(',').map(addr => addr.trim()).filter(addr => addr !== '') as `0x${string}`[];

        const result = await deployOpenZeppelinTimelock({
          minDelay: parseInt(minDelay),
          proposers: proposersList,
          executors: executorsList,
          admin: (admin.trim() || '0x0000000000000000000000000000000000000000') as `0x${string}`,
        });
        deployedContractAddress = result.contractAddress;
        transactionHash = result.transactionHash;
      }

      if (deployedContractAddress && transactionHash) {
        // Find chain name from chains data
        const selectedChainData = chains.find(chain => chain.chain_id === selectedChain);
        const chainName = selectedChainData?.chain_name || 'Unsupport Chain';

        setDialogDetails({
          chainName: chainName,
          chainIcon: <Image src="" alt="Chain Logo" width={16} height={16} className="mr-1" />,
          timelockAddress: deployedContractAddress,
          initiatingAddress: walletAddress,
          transactionHash: transactionHash,
        });
        setIsConfirmDialogOpen(true);
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      // The useDeployTimelock hook already handles toast messages for errors.
    }
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleConfirmDialogConfirm = async (remarkFromDialog: string) => {
    if (!accessToken || !walletAddress) {
      toast.error('Please connect your wallet.');
      return;
    }

    const body: Record<string, unknown> = {
      chain_id: selectedChain,
      chain_name: dialogDetails.chainName,
      min_delay: parseInt(minDelay),
      remark: remarkFromDialog || '',
      standard: selectedStandard,
      tx_hash: dialogDetails.transactionHash,
      contract_address: dialogDetails.timelockAddress,
    };

    if (selectedStandard === 'compound') {
      body.admin = admin.trim() || walletAddress;
    } else if (selectedStandard === 'openzeppelin') {
      const proposersList = proposers.split(',').map(addr => addr.trim()).filter(addr => addr !== '');
      const executorsList = executors.split(',').map(addr => addr.trim()).filter(addr => addr !== '');

      body.proposers = proposersList;
      body.executors = executorsList;
      body.cancellers = proposersList; // As per API doc: proposers就是cancellers
      body.admin = admin.trim() || '0x0000000000000000000000000000000000000000';
    }

    try {
      console.log('Creating timelock record with body:', body);

      const apiResponse = await createTimelockApiCall('/api/v1/timelock/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (apiResponse && apiResponse.success) {
        toast.success('Timelock created successfully!');
        // Reset form
        setSelectedStandard('compound');
        setMinDelay('259200');
        setProposers('');
        setExecutors('');
        setAdmin('');
        // Remark is now managed in the dialog
        // Redirect to timelocks page
        router.push(`/${locale}/timelocks`);
      } else {
        throw new Error(apiResponse?.error?.message || 'Failed to create timelock record');
      }
    } catch (error: unknown) {
      console.error('API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to create timelock record', {
        description: errorMessage
      });
    } finally {
      setIsConfirmDialogOpen(false);
    }
  };

  const handleChainChange = (newChainId: number) => {
    if (!newChainId) {
      toast.error('Please select a network'); 
      return;
    }
    setSelectedChain(newChainId);

    // Get the thirdweb chain object for the given chain ID
    const chainObject = getChainObject(newChainId);
    
    if (!chainObject) {
      console.error(`Chain ID ${newChainId} is not supported by thirdweb`);
      toast.error(`Chain ID ${newChainId} is not supported. Please use a supported network.`);
      return;
    }

    switchChain(chainObject);
  };

  useEffect(() => {
    if (chainId) setSelectedChain(chainId);
  }, [chainId]);

  return (
    <PageLayout title="创建Timelock">
      <div className=" bg-white p-8">
        <div className="mx-auto flex flex-col space-y-8">
          {/* Top Info Section */}
          <FirstTimeTimelockIntro />

          {/* Main Form Area */}
          <CreateTimelockForm
            selectedChain={selectedChain}
            onChainChange={handleChainChange}
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