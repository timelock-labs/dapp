import { useAuthStore } from "@/store/userStore";
import { formatAddress } from "@/utils/utils";

export default function HashLink({ hash, chainId }: { hash: string; chainId: number }) {
    const chains = useAuthStore(state => state.chains);
    const chain = chains?.find(c => c.chain_id === chainId);

    return (
        <a href={`${chain?.block_explorer_urls}/tx/${hash}`} target='_blank' rel='noopener noreferrer'>
            {formatAddress(hash)}
        </a>
    );
}