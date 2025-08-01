"use client";

import Image from "next/image";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useApi } from "@/hooks/useApi";
import { useDeployTimelock } from "@/hooks/useDeployTimelock";
import { useAuthStore } from "@/store/userStore";
import { toast } from "sonner";
import { useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import { useRouter, useParams } from "next/navigation";
import CreateTimelockForm from "./components/CreateTimelockForm";
import ConfirmCreationDialog from "./components/ConfirmCreationDialog";
import PageLayout from "@/components/layout/PageLayout";
import { getChainObject } from "@/utils/chainUtils";
import type { CreateTimelockFormState, DialogDetailsState, CreateTimelockRequestBody, DeploymentResult, CompoundTimelockParams } from "./components/types";
import type { ContractStandard } from "@/types/common";

const CreateTimelockPage: React.FC = () => {

  const [formState, setFormState] = useState<CreateTimelockFormState>({
    selectedChain: 1,
    selectedStandard: "compound",
    minDelay: "259200",
  });

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogDetails, setDialogDetails] = useState<DialogDetailsState>({
    chainName: "",
    chainIcon: <Image src="" alt="Chain Logo" width={16} height={16} className="mr-1" />,
    timelockAddress: "",
    initiatingAddress: "",
    transactionHash: "",
  });


  const { id: chainId } = useActiveWalletChain() || {};
  const switchChain = useSwitchActiveWalletChain();
  const { request: createTimelockApiCall } = useApi();
  const { accessToken, chains } = useAuthStore();
  const { address: walletAddress } = useActiveAccount() || {};
  const { deployCompoundTimelock, isLoading } = useDeployTimelock();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;


  const selectedChainData = useMemo(() => chains.find((chain) => chain.chain_id === formState.selectedChain), [chains, formState.selectedChain]);


  const handleChainChange = useCallback(
    (newChainId: number) => {
      if (!newChainId) {
        toast.error("Please select a network");
        return;
      }

      setFormState((prev) => ({ ...prev, selectedChain: newChainId }));

      // Get the thirdweb chain object for the given chain ID
      const chainObject = getChainObject(newChainId);

      if (!chainObject) {
        console.error(`Chain ID ${newChainId} is not supported by thirdweb`);
        toast.error(`Chain ID ${newChainId} is not supported. Please use a supported network.`);
        return;
      }

      switchChain(chainObject);
    },
    [switchChain],
  );

  const handleStandardChange = useCallback((standard: ContractStandard) => {
    setFormState((prev) => ({ ...prev, selectedStandard: standard }));
  }, []);

  const handleMinDelayChange = useCallback((minDelay: string) => {
    setFormState((prev) => ({ ...prev, minDelay }));
  }, []);

  // Deployment handlers
  const handleCreate = useCallback(async () => {
    if (!accessToken || !walletAddress) {
      toast.error("Please connect your wallet first.");
      return;
    }

    // Validation
    if (!formState.selectedChain || !formState.minDelay) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let deployedContractAddress: string | null = null;
    let transactionHash: string | null = null;

    try {
      console.log("Deploying timelock with standard:", formState.selectedStandard);

      if (formState.selectedStandard === "compound") {
        const params: CompoundTimelockParams = {
          minDelay: parseInt(formState.minDelay),
          admin: walletAddress as `0x${string}`,
        };
        const result: DeploymentResult = await deployCompoundTimelock(params);
        deployedContractAddress = result.contractAddress;
        transactionHash = result.transactionHash;
      }

      if (deployedContractAddress && transactionHash) {
        const chainName = selectedChainData?.chain_name || "Unsupport Chain";

        setDialogDetails({
          chainName,
          chainIcon: <Image src="" alt="Chain Logo" width={16} height={16} className="mr-1" />,
          timelockAddress: deployedContractAddress,
          initiatingAddress: walletAddress,
          transactionHash,
        });
        setIsConfirmDialogOpen(true);
      }
    } catch (error) {
      console.error("Deployment failed:", error);
      // The useDeployTimelock hook already handles toast messages for errors.
    }
  }, [accessToken, walletAddress, formState, selectedChainData, deployCompoundTimelock]);

  const handleConfirmDialogClose = useCallback(() => {
    setIsConfirmDialogOpen(false);
  }, []);

  const handleConfirmDialogConfirm = useCallback(
    async (remarkFromDialog: string) => {
      if (!accessToken || !walletAddress) {
        toast.error("Please connect your wallet.");
        return;
      }

      const body: CreateTimelockRequestBody = {
        admin: walletAddress as `0x${string}`,
        chain_id: formState.selectedChain,
        chain_name: dialogDetails.chainName,
        min_delay: parseInt(formState.minDelay),
        remark: remarkFromDialog || "",
        standard: formState.selectedStandard,
        tx_hash: dialogDetails.transactionHash,
        contract_address: dialogDetails.timelockAddress,
      };

      try {
        console.log("Creating timelock record with body:", body);

        const apiResponse = await createTimelockApiCall("/api/v1/timelock/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body,
        });

        if (apiResponse && apiResponse.success) {
          toast.success("Timelock created successfully!");
          // Reset form
          setFormState({
            selectedChain: 1,
            selectedStandard: "compound",
            minDelay: "259200",
          });
          // Redirect to timelocks page
          router.push(`/${locale}/timelocks`);
        } else {
          throw new Error(apiResponse?.error?.message || "Failed to create timelock record");
        }
      } catch (error: unknown) {
        console.error("API Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        toast.error("Failed to create timelock record", {
          description: errorMessage,
        });
      } finally {
        setIsConfirmDialogOpen(false);
      }
    },
    [accessToken, walletAddress, formState, dialogDetails, createTimelockApiCall, router, locale],
  );

  // Effect to sync chain ID
  useEffect(() => {
    if (chainId) {
      setFormState((prev) => ({ ...prev, selectedChain: chainId }));
    }
  }, [chainId]);

  return (
    <PageLayout title="创建Timelock">
      <div className="bg-white p-8">
        <div className="mx-auto flex flex-col space-y-8">
          {/* Main Form Area */}
          <CreateTimelockForm
            selectedChain={formState.selectedChain}
            onChainChange={handleChainChange}
            selectedStandard={formState.selectedStandard}
            onStandardChange={handleStandardChange}
            minDelay={formState.minDelay}
            onMinDelayChange={handleMinDelayChange}
            onDeploy={handleCreate}
            isLoading={isLoading}
          />
        </div>

        <ConfirmCreationDialog isOpen={isConfirmDialogOpen} onClose={handleConfirmDialogClose} onConfirm={handleConfirmDialogConfirm} creationDetails={dialogDetails} />
      </div>
    </PageLayout>
  );
};
export default CreateTimelockPage;
