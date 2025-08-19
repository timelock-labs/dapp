import { useAuthStore } from "@/store/userStore";
import Image from "next/image";
import { Network } from "lucide-react";

export default function ChainLabel({ chainId }: { chainId: number }) {
        const chains = useAuthStore(state => state.chains);
        
    const chain = chains?.find(c => c.chain_id === chainId);
    const chainLogo = chain?.logo_url;
    const chainName = chain?.display_name;

	return (
		<div className='flex gap-1 justify-center items-center bg-gray-100 rounded-xl p-1'>
			{chainLogo ?
				<Image
					src={chainLogo}
					alt={chainName}
					width={16}
					height={16}
					className='rounded-full'
					onError={e => {
						console.error('Failed to load chain logo:', chainLogo);
						e.currentTarget.style.display = 'none';
					}}
				/>
			: <Network className='h-4 w-4 text-gray-700' />}
			<span className='text-gray-800 font-medium'>{chainName}</span>
		</div>
	);
}