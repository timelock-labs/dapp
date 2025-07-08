"use client"

import { useState } from 'react';
import { useWalletClient, usePublicClient, useAccount } from 'wagmi';
import { Abi, Address, Hash } from 'viem';
import { toast } from 'sonner';

import { compoundTimelockAbi } from '@/contracts/abis/CompoundTimelock';
import { compoundTimelockBytecode } from '@/contracts/bytecodes/CompoundTimelock';
import { openzeppelinTimelockAbi } from '@/contracts/abis/OpenZeppelinTimelock';
import { openzeppelinTimelockBytecode } from '@/contracts/bytecodes/OpenZeppelinTimelock';

interface DeployResult {
  transactionHash: Hash;
  contractAddress: Address | null;
}

interface DeployCompoundParams {
  minDelay: number;
  admin: Address;
}

interface DeployOpenZeppelinParams {
  minDelay: number;
  proposers: Address[];
  executors: Address[];
  admin: Address;
}

export const useDeployTimelock = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address: accountAddress } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deployContract = async (abi: Abi, bytecode: Address, args: any[]): Promise<DeployResult> => {
    if (!walletClient || !accountAddress) {
      const err = new Error("Please connect your wallet first.");
      toast.error(err.message);
      throw err;
    }
    if (!publicClient) {
      const err = new Error("Could not connect to the network.");
      toast.error(err.message);
      throw err;
    }

    setIsLoading(true);
    setError(null);

    try {
      toast.info("Deploying contract... Please confirm in your wallet.");
      const hash = await walletClient.deployContract({
        abi,
        bytecode,
        args,
        account: accountAddress,
      });

      toast.loading("Transaction sent. Waiting for confirmation...", { id: hash });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'reverted' || !receipt.contractAddress) {
        throw new Error("Transaction failed or contract address not found.");
      }

      toast.success("Contract deployed successfully!", { id: hash });
      return {
        transactionHash: receipt.transactionHash,
        contractAddress: receipt.contractAddress,
      };
    } catch (e: any) {
      console.error("Deployment failed:", e);
      const errorMessage = e.shortMessage || e.message || "An unknown error occurred.";
      setError(new Error(errorMessage));
      toast.error("Deployment failed", { description: errorMessage });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const deployCompoundTimelock = async ({ admin, minDelay }: DeployCompoundParams) => {
    return deployContract(compoundTimelockAbi, compoundTimelockBytecode, [admin, BigInt(minDelay)]);
  };

  const deployOpenZeppelinTimelock = async ({ minDelay, proposers, executors, admin }: DeployOpenZeppelinParams) => {
    return deployContract(openzeppelinTimelockAbi, openzeppelinTimelockBytecode, [BigInt(minDelay), proposers, executors, admin]);
  };

  return {
    deployCompoundTimelock,
    deployOpenZeppelinTimelock,
    isLoading,
    error,
  };
};