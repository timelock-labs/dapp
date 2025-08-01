"use client"

import { useState } from 'react';
import { ethers, ContractReceipt, ContractInterface } from 'ethers';
import { useActiveAccount } from 'thirdweb/react';

import { toast } from 'sonner';

import { useWeb3React } from './useWeb3React';
type Address = string;
type Hash = string;

interface TransactionResult {
  transactionHash: Hash;
}

interface SendTransactionParams {
  toAddress: Address;
  calldata: string;
  value?: string; // Optional, can be undefined if not needed
}

export const useTimelockTransaction = () => {
  const { account: accountAddress, sendTransaction: sendTx } = useWeb3React();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendTransaction = async ({  toAddress,calldata,value }:any)  => {

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
        to: toAddress,
        data: calldata,
        value: ethers.BigNumber.from(value).toString(),
      });

      const hash = tx.transactionHash;

      toast.loading("Transaction sent. Waiting for confirmation...", {
        id: hash,
      });

      // const receipt: ContractReceipt = await tx.wait();

      // if (!receipt || receipt.status === 0) {
      //   throw new Error("Transaction failed.");
      // }

      toast.success("Transaction confirmed successfully!", {
        id: hash,
      });

      return {
        transactionHash: hash,
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
