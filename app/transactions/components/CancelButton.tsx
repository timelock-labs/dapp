import { useAuthStore } from '@/store/userStore';
import { ethers } from 'ethers';
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
			toast.error(`Please switch to ${currentChain!.display_name} network to cancel this timelock.`);
			return;
		}

		const Timelock = new ethers.Contract(
			timelock.contract_address,
			compoundTimelockAbi, // Minimal ABI for cancel function
			signer
		);

		const etaTimestamp = new Date(timelock.eta);
		const eta = etaTimestamp.getTime() / 1000; // Convert to seconds

		try {
			const tx = await Timelock.cancelTransaction(
				timelock.target_address, 
				timelock.value, 
				timelock.function_signature, 
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
		<button className='cursor-pointer leading-5 bg-red-100 text-red-800 font-bold text-xs px-2 py-1 rounded-full hover:bg-red-300 transition-colors duration-200' onClick={handleCancel}>
			Cancel
		</button>
	);
};

export default CancelButton;
