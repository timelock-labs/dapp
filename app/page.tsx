import Image from "next/image";
import { ConnectWallet } from '@/components/wallet/connect-wallet'
import { ChainSwitcher } from '@/components/wallet/chain-switcher'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Timelock UI</h1>
          <div className="flex items-center gap-4">
            <ChainSwitcher />
            <ConnectWallet />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl mb-4">Welcome to Timelock UI</h2>
        <p>Connect your wallet to get started with multiple chains:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Ethereum Mainnet</li>
          <li>BSC (Binance Smart Chain)</li>
          <li>Arbitrum</li>
          <li>HashKey Chain</li>
        </ul>
      </main>
    </div>
  );
}
