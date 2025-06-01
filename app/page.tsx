
export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 p-4">
          <h3 className="font-semibold mb-2">Active Timelocks</h3>
          <p className="text-2xl font-bold text-primary">12</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 p-4">
          <h3 className="font-semibold mb-2">Total Value Locked</h3>
          <p className="text-2xl font-bold text-primary">$2.4M</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 p-4">
          <h3 className="font-semibold mb-2">Chains Supported</h3>
          <p className="text-2xl font-bold text-primary">4</p>
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-6 md:min-h-min">
        <h2 className="text-xl font-semibold mb-4">Welcome to Timelock UI</h2>
        <p className="text-muted-foreground mb-4">
          Connect your wallet to start managing timelock contracts across multiple chains.
        </p>
        <div className="space-y-2">
          <h3 className="font-medium">Supported Networks:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Ethereum Mainnet</li>
            <li>BSC (Binance Smart Chain)</li>
            <li>Arbitrum</li>
            <li>HashKey Chain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
