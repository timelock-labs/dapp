import { useAuthStore } from "@/store/userStore";
import { formatAddress } from "@/utils/utils";

export default function HashLink({ hash, chainId, className }: { hash: string; chainId: number; className?: string }) {
    const chains = useAuthStore(state => state.chains);
    const chain = chains?.find(c => c.chain_id === chainId);

    return (
        <a href={`${chain?.block_explorer_urls}/tx/${hash}`} target='_blank' rel='noopener noreferrer' className={className}>
            {formatAddress(hash)}
        </a>
    );
}