import { ethers, type Signer } from 'ethers';
import type { ContractInterface } from 'ethers';
// Safe SDK imports temporarily disabled due to version compatibility issues
// import SafeApiKit from '@safe-global/api-kit';
// import Safe from '@safe-global/protocol-kit';
// import { MetaTransactionData, OperationType } from '@safe-global/types-kit';

export type SupportedChainId = 1 | 5 | 11155111 | 137 | 56;

// Safe CreateCall contract address and ABI for contract deployment
const CREATE_CALL_ADDRESS = '0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d';
const CREATE_CALL_ABI = [
  "function performCreate(uint256 value, bytes deploymentData) returns (address newContract)"
];

// Safe ProxyFactory addresses for different chains (for address prediction)
const SAFE_PROXY_FACTORY_ADDRESSES = {
  1: '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67', // Ethereum Mainnet (v1.4.1)
  5: '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67', // Goerli (v1.4.1)
  11155111: '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67', // Sepolia (v1.4.1)
  137: '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67', // Polygon (v1.4.1)
  56: '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67', // BSC (v1.4.1)
} as const;

// Safe Singleton (implementation) addresses for different chains
const SAFE_SINGLETON_ADDRESSES = {
  1: '0x41675C099F32341bf84BFc5382aF534df5C7461a', // Ethereum Mainnet (v1.4.1)
  5: '0x41675C099F32341bf84BFc5382aF534df5C7461a', // Goerli (v1.4.1)
  11155111: '0x41675C099F32341bf84BFc5382aF534df5C7461a', // Sepolia (v1.4.1)
  137: '0x41675C099F32341bf84BFc5382aF534df5C7461a', // Polygon (v1.4.1)
  56: '0x41675C099F32341bf84BFc5382aF534df5C7461a', // BSC (v1.4.1)
} as const;

// Safe Transaction Service URLs for different networks
const SAFE_TX_SERVICE_URLS = {
  1: 'https://safe-transaction-mainnet.safe.global/',
  5: 'https://safe-transaction-goerli.safe.global/',
  11155111: 'https://safe-transaction-sepolia.safe.global/', // Sepolia
  137: 'https://safe-transaction-polygon.safe.global/',
  56: 'https://safe-transaction-bsc.safe.global/',
} as const;

export interface SafeDeploymentTransactionData {
  to: string;
  value: string;
  data: string;
}

export interface SafeTransactionProposal {
  safeAddress: string;
  transactionData: SafeDeploymentTransactionData;
  safeTxHash: string;
  senderAddress: string;
  senderSignature: string;
}

export interface SafeDeploymentResult {
  success: boolean;
  safeTxHash?: string;
  transactionHash?: string;
  contractAddress?: string;
  predictedAddress?: string;
  error?: string;
  proposalSubmitted?: boolean;
  message?: string;
  safeAppUrl?: string;
  transactionData?: SafeDeploymentTransactionData;
}

/**
 * Enhanced Safe wallet detection using Safe Transaction Service API
 */
export async function isSafeWallet(
  address: string,
  signer: Signer,
  chainId: SupportedChainId
): Promise<boolean> {
  try {
    // Check if the chain is supported by Safe Transaction Service
    if (!isSupportedChain(chainId)) {
      console.warn(`Chain ${chainId} is not supported by Safe Transaction Service`);
      return false;
    }

    // Use Safe Transaction Service API to check if address is a Safe
    const safeServiceUrl = getSafeServiceUrl(chainId);
    const response = await fetch(`${safeServiceUrl}api/v1/safes/${address}/`);
    if (response.ok) {
      // If API returns 200, it's a valid Safe wallet
      return true;
    } else if (response.status === 404) {
      // If API returns 404, it's not a Safe wallet
      return false;
    } else {
      // For other errors, fall back to contract check
      console.warn(`Safe API returned status ${response.status}, falling back to contract check`);
      return await fallbackContractCheck(address, signer);
    }
  } catch (error) {
    console.error('Safe wallet detection failed, falling back to contract check:', error);
    // Fall back to contract-based detection if API fails
    return await fallbackContractCheck(address, signer);
  }
}

/**
 * Fallback method using contract calls when API is unavailable
 */
async function fallbackContractCheck(address: string, signer: Signer): Promise<boolean> {
  try {
    if (!signer.provider) {
      return false;
    }

    // Basic check: if the address has contract code
    const code = await signer.provider.getCode(address);
    if (code === '0x') {
      return false;
    }

    // Check if the contract implements Safe interface
    const contract = new ethers.Contract(address, [
      'function getVersion() view returns (string)',
      'function getOwners() view returns (address[])',
      'function getThreshold() view returns (uint256)',
    ], signer);

    // Try to call Safe-specific functions
    const [version, owners, threshold] = await Promise.all([
      contract.getVersion(),
      contract.getOwners(),
      contract.getThreshold(),
    ]);

    // Additional validation
    return (
      typeof version === 'string' && 
      Array.isArray(owners) && 
      owners.length > 0 &&
      threshold > 0
    );
  } catch {
    return false;
  }
}

/**
 * Get detailed Safe wallet information using Safe Transaction Service API
 */
export async function getSafeInfo(
  safeAddress: string,
  signer: Signer,
  chainId: SupportedChainId
) {
  try {
    // Check if the chain is supported by Safe Transaction Service
    if (!isSupportedChain(chainId)) {
      console.warn(`Chain ${chainId} is not supported by Safe Transaction Service, falling back to contract calls`);
      return await fallbackGetSafeInfo(safeAddress, signer);
    }

    // Use Safe Transaction Service API to get Safe information
    const safeServiceUrl = getSafeServiceUrl(chainId);
    const response = await fetch(`${safeServiceUrl}api/v1/safes/${safeAddress}/`);
    
    if (response.ok) {
      const safeData = await response.json();
      
      // Transform API response to match expected format
      return {
        owners: safeData.owners,
        threshold: safeData.threshold,
        nonce: safeData.nonce,
        version: safeData.version,
        address: safeAddress,
      };
    } else if (response.status === 404) {
      throw new Error('Safe not found - the address is not a valid Safe wallet');
    } else {
      console.warn(`Safe API returned status ${response.status}, falling back to contract calls`);
      return await fallbackGetSafeInfo(safeAddress, signer);
    }
  } catch (error) {
    console.error('Failed to get Safe info via API, falling back to contract calls:', error);
    return await fallbackGetSafeInfo(safeAddress, signer);
  }
}

/**
 * Predict the contract address that will be deployed using CREATE opcode
 * @param deployerAddress The address that will deploy the contract (Safe wallet address)
 * @param nonce The nonce of the deployer at the time of deployment
 * @returns The predicted contract address
 */
export function predictContractAddress(deployerAddress: string, nonce: number): string {
  try {
    // Use ethers.js utils to predict the contract address
    // For CREATE opcode: address = keccak256(rlp([sender, nonce]))
    return ethers.utils.getContractAddress({
      from: deployerAddress,
      nonce: nonce
    });
  } catch (error) {
    console.error('Failed to predict contract address:', error);
    throw new Error(`Address prediction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Predict the address of a contract deployed via Safe's CREATE_CALL using CREATE2
 * This function predicts the address where a timelock contract will be deployed
 * when using Safe's createCall functionality
 */
export function predictSafeDeployedContractAddress(
  safeAddress: string,
  constructorArgs: unknown[],
  abi: ContractInterface,
  bytecode: string,
  saltNonce: number = 0
): string {
  try {
    // Create contract factory to get deployment data
    const contractFactory = new ethers.ContractFactory(abi, bytecode);
    const deployTransaction = contractFactory.getDeployTransaction(...constructorArgs);
    
    if (!deployTransaction.data) {
      throw new Error('Failed to generate deployment transaction data');
    }

    const creationBytecode = typeof deployTransaction.data === 'string' 
      ? deployTransaction.data 
      : ethers.utils.hexlify(deployTransaction.data);

    // For Safe CREATE2 deployment, the salt is constructed from:
    // salt = keccak256(abi.encodePacked(keccak256(creationBytecode), saltNonce))
    const bytecodeHash = ethers.utils.keccak256(creationBytecode);
    const salt = ethers.utils.keccak256(
      ethers.utils.solidityPack(['bytes32', 'uint256'], [bytecodeHash, saltNonce])
    );

    // Use CREATE2 formula to predict address
    // For Safe CREATE calls, the deployer is the Safe wallet itself
    return ethers.utils.getCreate2Address(
      safeAddress, // deployer (the Safe wallet)
      salt,        // computed salt
      ethers.utils.keccak256(creationBytecode) // init code hash
    );
  } catch (error) {
    console.error('Failed to predict Safe deployed contract address:', error);
    throw new Error(`Address prediction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fallback method to get Safe info using contract calls when API is unavailable
 */
async function fallbackGetSafeInfo(safeAddress: string, signer: Signer) {
  try {
    const contract = new ethers.Contract(safeAddress, [
      'function getVersion() view returns (string)',
      'function getOwners() view returns (address[])',
      'function getThreshold() view returns (uint256)',
      'function nonce() view returns (uint256)',
    ], signer);

    const [version, owners, threshold, nonce] = await Promise.all([
      contract.getVersion(),
      contract.getOwners(),
      contract.getThreshold(),
      contract.nonce(),
    ]);

    return {
      owners,
      threshold: threshold.toNumber(),
      nonce: nonce.toNumber(),
      version,
      address: safeAddress,
    };
  } catch (error) {
    console.error('Failed to get Safe info:', error);
    throw new Error(`Failed to retrieve Safe information: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


/**
 * Create a Safe deployment proposal with enhanced user experience
 * This creates the transaction data and guides the user to complete in Safe App
 */
export async function createSafeDeploymentProposal(
  abi: ContractInterface,
  bytecode: string,
  constructorArgs: unknown[],
  signer: Signer,
  safeAddress: string,
  chainId: SupportedChainId,
  value = '0'
): Promise<SafeDeploymentResult> {
  try {
    // Validate Safe wallet first
    const isValidSafe = await isSafeWallet(safeAddress, signer, chainId);
    if (!isValidSafe) {
      throw new Error('The provided address is not a valid Safe wallet');
    }

    // Get Safe info for better user experience
    const safeInfo = await getSafeInfo(safeAddress, signer, chainId);
    
    // Predict the contract address that will be deployed
    // When using Safe's CreateCall library, the actual deployer is the CREATE_CALL_ADDRESS contract
    // and it uses the CREATE opcode, so we predict based on the CREATE_CALL_ADDRESS nonce
    let predictedAddress: string;
    try {
      if (!signer.provider) {
        throw new Error('Provider not available');
      }
      
      // Get the current nonce of CREATE_CALL_ADDRESS contract (the actual deployer)
      const createCallNonce = await signer.provider.getTransactionCount(CREATE_CALL_ADDRESS);
      predictedAddress = predictContractAddress(CREATE_CALL_ADDRESS, createCallNonce);
    } catch (error) {
      console.warn('Failed to predict contract address:', error);
      predictedAddress = 'Unable to predict (will be available after deployment)';
    }
    
    // Create contract factory to get deployment data
    const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
    
    const deployTransaction = contractFactory.getDeployTransaction(...constructorArgs);
    
    if (!deployTransaction.data) {
      throw new Error('Failed to generate deployment transaction data');
    }

    // Get Timelock contract creation bytecode
    const timelockCreationBytecode = typeof deployTransaction.data === 'string' 
      ? deployTransaction.data 
      : ethers.utils.hexlify(deployTransaction.data);

    // Encode call to CreateCall contract's performCreate function
    const createCallInterface = new ethers.utils.Interface(CREATE_CALL_ABI);
    const calldataForCreateCall = createCallInterface.encodeFunctionData("performCreate", [
      0, // value - don't send ETH with deployment
      timelockCreationBytecode // Timelock contract creation bytecode
    ]);

    // For now, use manual mode since SDK version compatibility issues
    // Safe SDK v6+ requires different initialization patterns
    
    const fallbackSafeTxHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['address', 'uint256', 'bytes'],
        [safeAddress, safeInfo.nonce, calldataForCreateCall]
      )
    );
    
    // Create Safe App URL for Transaction Builder
    const safeAppUrl = getSafeAppUrl(safeAddress, chainId);

    const result = {
      success: true,
      safeTxHash: fallbackSafeTxHash,
      predictedAddress: predictedAddress,
      proposalSubmitted: false,
      safeAppUrl: safeAppUrl,
      transactionData: { // Include transaction data for JSON export if needed
        to: CREATE_CALL_ADDRESS, // CreateCall contract address for deployment
        value: value || '0',
        data: calldataForCreateCall, // Encoded call to performCreate function
      },
      message: `📋 Safe deployment transaction prepared successfully!\n\n🔧 Transaction Details:\n- To: ${CREATE_CALL_ADDRESS} (CreateCall Contract)\n- Value: 0 ETH\n- Data: performCreate function call\n- Data Length: ${calldataForCreateCall.length} bytes\n- Predicted Contract Address: ${predictedAddress}\n\n📥 Next Steps:\n1. Click "Download JSON" below to get the transaction file\n2. Click "Open Safe App" to access Transaction Builder\n3. Import the downloaded JSON file in Safe App\n4. Review and execute the transaction\n\n📝 Required signatures: ${safeInfo.threshold}/${safeInfo.owners.length}`,
    };
    
    return result;

  } catch (error) {
    console.error('Safe deployment proposal failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      proposalSubmitted: false,
    };
  }
}

/**
 * Get Safe App URL - directs to Transaction Builder for JSON import workflow
 */
export function getSafeAppUrl(
  safeAddress: string,
  chainId: SupportedChainId
): string {
  const chainPrefix = getChainShortName(chainId);
  
  // Always direct to Transaction Builder for manual JSON import
  return `https://app.safe.global/apps?safe=${chainPrefix}:${safeAddress}&appUrl=https%3A%2F%2Fapps.gnosis-safe.io%2Ftx-builder`;
}

/**
 * Get short chain name for Safe App URLs
 */
function getChainShortName(chainId: SupportedChainId): string {
  const chainNames: Record<SupportedChainId, string> = {
    1: 'eth',
    5: 'gor',
    11155111: 'sep',
    137: 'matic',
    56: 'bnb',
  };
  
  return chainNames[chainId] || 'eth';
}

/**
 * Helper function to create a deep link to Safe App
 */
export function createSafeAppDeepLink(
  safeAddress: string,
  chainId: SupportedChainId,
  transactionData?: SafeDeploymentTransactionData
): { url: string; message: string; instructions: string[] } {
  const url = getSafeAppUrl(safeAddress, chainId);
  
  const message = transactionData 
    ? `Open Safe App to create and execute the contract deployment transaction`
    : `Open Safe App to manage your Safe wallet`;

  const instructions = transactionData ? [
    '1. Open the Safe App using the provided link',
    '2. Navigate to Transaction Builder',
    '3. Create a new transaction with the following details:',
    `   - To: ${transactionData.to}`,
    `   - Value: ${transactionData.value} ETH`,
    `   - Data: ${transactionData.data.substring(0, 50)}...`,
    '4. Review and submit the transaction',
    '5. Collect required signatures from other Safe owners',
    '6. Execute the transaction once threshold is reached'
  ] : [
    '1. Open the Safe App using the provided link',
    '2. Review your Safe wallet settings',
    '3. Manage transactions and settings as needed'
  ];
    
  return { url, message, instructions };
}

/**
 * Estimate gas cost for Safe transaction execution
 */
export async function estimateSafeTransactionGas(
  _safeAddress: string,
  transactionData: SafeDeploymentTransactionData,
  signer: Signer
) {
  try {
    if (!signer.provider) {
      throw new Error('Provider not available');
    }

    // Estimate gas for the deployment transaction
    const gasEstimate = await signer.provider.estimateGas({
      to: transactionData.to,
      data: transactionData.data,
      value: transactionData.value || '0',
    });

    const gasPrice = await signer.provider.getGasPrice();

    // Add overhead for Safe transaction execution
    const safeOverhead = 40000; // Approximate Safe execution overhead
    const totalGas = gasEstimate.add(safeOverhead);

    return {
      gasLimit: totalGas.toString(),
      gasPrice: gasPrice.toString(),
      estimatedCost: ethers.utils.formatEther(totalGas.mul(gasPrice)),
    };
  } catch (error) {
    console.error('Failed to estimate Safe transaction gas:', error);
    
    // Return higher default estimates for Safe transactions
    return {
      gasLimit: '800000', // Higher default for Safe + deployment
      gasPrice: '20000000000', // 20 gwei
      estimatedCost: '0.016', // ETH
    };
  }
}

/**
 * Check transaction status in Safe Transaction Service
 */
export async function checkSafeTransactionStatus(
  safeTxHash: string,
  chainId: SupportedChainId
) {
  try {
    const safeServiceUrl = getSafeServiceUrl(chainId);
    const response = await fetch(
      `${safeServiceUrl}api/v1/multisig-transactions/${safeTxHash}/`
    );
    
    if (response.ok) {
      return await response.json();
    } else if (response.status === 404) {
      return null; // Transaction not found
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to check Safe transaction status:', error);
    throw error;
  }
}

/**
 * Check if a chain is supported for Safe operations
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return chainId in SAFE_TX_SERVICE_URLS;
}

/**
 * Get the Safe Transaction Service URL for a chain
 */
export function getSafeServiceUrl(chainId: SupportedChainId): string {
  return SAFE_TX_SERVICE_URLS[chainId];
}