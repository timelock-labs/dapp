"use client"

import { useState } from 'react';
import { ethers, ContractReceipt, ContractInterface } from 'ethers';
import { useAddress, useSigner } from '@thirdweb-dev/react';
import { toast } from 'sonner';

import { compoundTimelockAbi } from '@/contracts/abis/CompoundTimelock';
import { openzeppelinTimelockAbi } from '@/contracts/abis/OpenZeppelinTimelock';

type Address = string;
type Hash = string;

interface TransactionResult {
  transactionHash: Hash;
}

interface SendTransactionParams {
  timelockAddress: Address;
  timelockStandard: 'compound' | 'openzeppelin';
  functionName: string;
  args: unknown[];
}

export const useTimelockTransaction = () => {
  const accountAddress = useAddress();
  const signer = useSigner();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendTransaction = async ({ timelockAddress, timelockStandard, functionName, args }: SendTransactionParams): Promise<TransactionResult> => {
    if (!accountAddress || !signer) {
      const err = new Error("Please connect your wallet first.");
      toast.error(err.message);
      throw err;
    }

    setIsLoading(true);
    setError(null);

    try {
      const abi = timelockStandard === 'compound' ? compoundTimelockAbi : openzeppelinTimelockAbi;

      const contract = new ethers.Contract(timelockAddress, abi as ContractInterface, signer);

      toast.info("Sending transaction... Please confirm in your wallet.");

      // Call the contract function
      const tx = await contract[functionName](...args);

      const hash = tx.hash;

      toast.loading("Transaction sent. Waiting for confirmation...", {
        id: hash,
      });

      // Wait for the transaction to be mined
      const receipt: ContractReceipt = await tx.wait();

      if (!receipt || receipt.status === 0) {
        throw new Error("Transaction failed.");
      }

      toast.success("Transaction confirmed successfully!", {
        id: hash,
      });

      return {
        transactionHash: receipt.transactionHash,
      };
    } catch (e: unknown) {
      console.error("Transaction failed:", e);
      let errorMessage = "An unknown error occurred.";
      
      if (e instanceof Error) {
        errorMessage = e.message;
        if (e.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected by user.";
        }
      }
      
      setError(new Error(errorMessage));
      toast.error("Transaction failed", { description: errorMessage });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendTransaction,
    isLoading,
    error,
  };
};
