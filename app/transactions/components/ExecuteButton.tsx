import { useAuthStore } from '@/store/userStore';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { useActiveWalletChain } from 'thirdweb/react';
import { compoundTimelockAbi } from '@/contracts/abis/CompoundTimelock'; // Import the minimal ABI for the timelock contract
import { useContractDeployment } from '@/hooks/useBlockchainHooks';
import TableButton from '@/components/tableContent/TableButton';
import { useTranslations } from 'next-intl';
import { Timelock } from '@/types/api/timelock';

const ExecuteButton = ({ timelock }: { timelock: Timelock }) => {
    const { id: chainId } = useActiveWalletChain() || {};
    const chains = useAuthStore(state => state.chains);
    const { signer } = useContractDeployment();
    const t = useTranslations('transactions');

    const handleExecute = async () => {
        if (chainId !== timelock.chain_id) {
            const currentChain = chains.find(chain => chain.chain_id === timelock.chain_id);
            toast.error(t('pleaseSwitchToNetwork', { network: currentChain!.display_name }));
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
            const tx = await Timelock.executeTransaction(
                timelock.target_address,
                timelock.value,
                timelock.function_signature,
                timelock.call_data_hex,
                eta
                , {
                    value: ethers.utils.parseEther(timelock.value || '0') // Ensure value is set correctly
                }
            );

            await tx.wait();
            toast.success(t('executeSuccess'));
        } catch (error) {
            console.error('Error executing timelock:', error);
            toast.error(t('failedToExecuteTimelock'));
        }
    };

    return <TableButton label='Execute' onClick={handleExecute} colorType='green' />

};

export default ExecuteButton;
