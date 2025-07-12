"use client"

import { useState } from 'react';
import { ethers, ContractReceipt } from 'ethers';
import type { ContractInterface } from 'ethers';
import { useAddress, useSigner } from '@thirdweb-dev/react';
import { toast } from 'sonner';

import { compoundTimelockAbi } from '@/contracts/abis/CompoundTimelock';
import { compoundTimelockBytecode } from '@/contracts/bytecodes/CompoundTimelock';
import { openzeppelinTimelockAbi } from '@/contracts/abis/OpenZeppelinTimelock';
import { openzeppelinTimelockBytecode } from '@/contracts/bytecodes/OpenZeppelinTimelock';

type Address = string;
type Hash = string;

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
  const accountAddress = useAddress();
  const signer = useSigner();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deployContract = async (abi: ContractInterface, bytecode: string, args: unknown[]): Promise<DeployResult> => {
    if (!accountAddress || !signer) {
      const err = new Error("Please connect your wallet first.");
      toast.error(err.message);
      throw err;
    }

    // 验证 bytecode
    if (!bytecode || bytecode === "0x..." || bytecode.length < 10) {
      const err = new Error("Contract bytecode is not configured. This appears to be a development environment. Please configure the actual contract bytecode before deployment.");
      toast.error(err.message);
      console.error("Bytecode validation failed:", { 
        bytecode: bytecode?.substring(0, 20) + "...", 
        length: bytecode?.length 
      });
      throw err;
    }

    // 确保 bytecode 以 0x 开头
    const validBytecode = bytecode.startsWith('0x') ? bytecode : `0x${bytecode}`;

    // 额外验证：确保bytecode看起来像有效的合约字节码
    if (validBytecode.length < 100) {
      const err = new Error("Bytecode appears to be too short for a valid contract.");
      toast.error(err.message);
      throw err;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Deploying contract with:", {
        abiLength: Array.isArray(abi) ? abi.length : "unknown",
        bytecodeLength: validBytecode.length,
        argsCount: args.length
      });

      // useSigner() 返回的是一个 ethers v5 的 Signer，可以直接使用
      const factory = new ethers.ContractFactory(abi, validBytecode, signer);

      toast.info("Deploying contract... Please confirm in your wallet.");

      // 部署合约
      const contract = await factory.deploy(...args);

      const deployTx = contract.deployTransaction;
      const hash = deployTx.hash;

      toast.loading("Transaction sent. Waiting for confirmation...", {
        id: hash,
      });

      // 等待交易被打包 (ethers v5)
      const receipt: ContractReceipt = await deployTx.wait();

      // 在 ethers v5 中, status 为 0 表示失败, 1 表示成功
      if (!receipt || receipt.status === 0 || !receipt.contractAddress) {
        throw new Error("Transaction failed or contract address not found.");
      }

      toast.success("Contract deployed successfully!", {
        id: hash,
      });

      return {
        transactionHash: receipt.transactionHash,
        contractAddress: receipt.contractAddress,
      };
    } catch (e: unknown) {
      console.error("Deployment failed:", e);
      let errorMessage = "An unknown error occurred.";
      
      if (e instanceof Error) {
        errorMessage = e.message;
        // 检查常见的错误类型
        if (e.message.includes("invalid bytecode")) {
          errorMessage = "Invalid contract bytecode. Please check the contract configuration.";
        } else if (e.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for deployment. Please check your wallet balance.";
        } else if (e.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected by user.";
        }
      }
      
      setError(new Error(errorMessage));
      toast.error("Deployment failed", { description: errorMessage });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const deployCompoundTimelock = async ({ admin, minDelay }: DeployCompoundParams) => {
    return deployContract(compoundTimelockAbi as ContractInterface, compoundTimelockBytecode, [admin, BigInt(minDelay)]);
  };

  const deployOpenZeppelinTimelock = async ({ minDelay, proposers, executors, admin }: DeployOpenZeppelinParams) => {
    return deployContract(openzeppelinTimelockAbi as ContractInterface, openzeppelinTimelockBytecode, [BigInt(minDelay), proposers, executors, admin]);
  };

  return {
    deployCompoundTimelock,
    deployOpenZeppelinTimelock,
    isLoading,
    error,
  };
};
