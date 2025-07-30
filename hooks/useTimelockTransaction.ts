"use client"

import { useState } from 'react';
import { ethers, ContractReceipt, ContractInterface } from 'ethers';
import { useActiveAccount } from 'thirdweb/react';

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
  toAddress: Address;
  calldata: string;
  value?: string; // Optional, can be undefined if not needed
}

export const useTimelockTransaction = () => {
  const { address: accountAddress, sendTransaction: sendTx } = useActiveAccount()!;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendTransaction = async ({ timelockAddress, toAddress,calldata,value = 0 }:any)  => {

    alert(`Sending transaction to ${timelockAddress} with calldata: ${calldata}`);

    if (!accountAddress) {
      const err = new Error("Please connect your wallet first.");
      toast.error(err.message);
      throw err;
    }

    setIsLoading(true);
    setError(null);

    try {
      toast.info("Sending transaction... Please confirm in your wallet.");

      const tx = await sendTx({
        to: timelockAddress,
        data: calldata,
        value: ethers.BigNumber.from(value),
      });

      const hash = tx.transactionHash;

      toast.loading("Transaction sent. Waiting for confirmation...", {
        id: hash,
      });

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
