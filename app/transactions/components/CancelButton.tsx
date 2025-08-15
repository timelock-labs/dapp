
import { useWeb3React } from '@/hooks/useWeb3React';
import { useAuthStore } from '@/store/userStore';
import { ethers } from 'ethers';
import React, { use } from 'react';
import { toast } from 'sonner';
import { useActiveWalletChain } from 'thirdweb/react';
import { compoundTimelockAbi } from '@/contracts/abis/CompoundTimelock'; // Import the minimal ABI for the timelock contract
import { useContractDeployment } from '@/hooks/useBlockchainHooks';

const CancelButton = ({ timelock }) => {

    const { id: chainId } = useActiveWalletChain() || {};
    const chains = useAuthStore(state => state.chains);
    const { signer } = useContractDeployment();

    const handleCancel = async () => {
        if (chainId !== timelock.chain_id) {
            const currentChain = chains.find(chain => chain.chain_id === timelock.chain_id);
            toast.error(`Please switch to ${currentChain.display_name} network to cancel this timelock.`);
            return;
        }

        const Timelock = new ethers.Contract(
            timelock.contract_address,
            compoundTimelockAbi, // Minimal ABI for cancel function
            signer
        );

        let etaTimestamp = new Date(timelock.eta);
        const eta = etaTimestamp.getTime() / 1000; // Convert to seconds

        try {

            alert(JSON.stringify({
                target: timelock.target_address,
                value: timelock.value,
                // timelock.signature,
                sig: "approve(address,uint256)",
                calldata: timelock.call_data_hex,
                eta

            }, null, 2));
            const tx = await Timelock.cancelTransaction(
                timelock.target_address,
                timelock.value,
                timelock.signature,
                timelock.call_data_hex,
                eta
            );

            await tx.wait();
            toast.success('Timelock transaction cancelled successfully!');
        } catch (error) {
            console.error('Error cancelling timelock:', error);
            toast.error('Failed to cancel timelock transaction. Please try again.');
        }
    };

    return (
        <button className='cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200' onClick={handleCancel}>
            Cancel
        </button>
    );
}

export default CancelButton;