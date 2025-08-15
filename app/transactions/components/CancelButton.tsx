
import { useWeb3React } from '@/hooks/useWeb3React';
import { useAuthStore } from '@/store/userStore';
import { ethers } from 'ethers';
import React, { use } from 'react';
import { toast } from 'sonner';
import { useActiveWalletChain } from 'thirdweb/react';
import { compoundTimelockAbi } from '@/contracts/abis/CompoundTimelock'; // Import the minimal ABI for the timelock contract

const CancelButton = ({ timelock }) => {

    const { id: chainId } = useActiveWalletChain() || {};
    const chains = useAuthStore(state => state.chains);
    const { provider } = useWeb3React();

    const handleCheckNetwork = async () => {
        if (chainId !== timelock.chain_id) {
            const currentChain = chains.find(chain => chain.chain_id === timelock.chain_id);
            toast.error(`Please switch to ${currentChain.display_name} network to cancel this timelock.`);
            return;
        }

        const Timelock = new ethers.Contract(
            timelock.contract_address,
            compoundTimelockAbi, // Minimal ABI for cancel function
            provider.getSigner()
        );

        let etaTimestamp = new Date(timelock.eta * 1000);
        etaTimestamp = etaTimestamp.getTime() / 1000; // Convert to seconds

        const tx = await Timelock.cancelTransaction(
            timelock.target_address,
            timelock.value,
            timelock.signature,
            timelock.call_data_hex,
           etaTimestamp
        );

        await tx.wait();
        toast.success('Timelock transaction cancelled successfully!');
        // Logic to cancel the timelock goes here
        console.log(`Cancelling timelock on chain ${timelock.chain_id}...`);
    };

    const handleCancel = () => {
        handleCheckNetwork();
        // Additional logic for canceling the timelock can be added here
    };
    return (
        <button className='cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200' onClick={handleCancel}>
            Cancel {JSON.stringify(timelock)}
        </button>
    );
}

export default CancelButton;