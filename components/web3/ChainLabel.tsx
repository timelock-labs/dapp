import { useAuthStore } from "@/store/userStore";
import Image from "next/image";
import { Network } from "lucide-react";

export default function ChainLabel({ chainId }: { chainId: number|string }) {
    const chains = useAuthStore(state => state.chains);

    const chain = chains?.find(c => c.chain_id.toString() === chainId.toString());
    const chainLogo = chain?.logo_url;
    const chainName = chain?.display_name;

    return (
        <div className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100'>
            {chainLogo ?
                <Image
                    src={chainLogo}
                    alt={chainName}
                    width={16}
                    height={16}
                    className='rounded-full overflow-hidden'
                    onError={e => {
                        console.error('Failed to load chain logo:', chainLogo);
                        e.currentTarget.style.display = 'none';
                    }}
                />
                : <Network className='h-4 w-4  ' />}
            <span className='font-medium'>{chainName}</span>
        </div>
    );
}