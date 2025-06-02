
import {useTranslations} from 'next-intl';

export default function Page() {
    const tDashboard = useTranslations('dashboard');
    const tChains = useTranslations('chains');


  return (
    <div className="flex flex-1 flex-col gap-4">
       <div>
    </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 p-4">
          {/* Assuming this card should show "Active Timelocks" from the dashboard namespace */}
          <h3 className="font-semibold mb-2">{tDashboard('active_timelocks')}</h3>
          <p className="text-2xl font-bold text-primary">12</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 p-4">
          <h3 className="font-semibold mb-2">{tDashboard('total_value_locked')}</h3>
          <p className="text-2xl font-bold text-primary">$2.4M</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 p-4">
          <h3 className="font-semibold mb-2">{tDashboard('chains_supported')}</h3>
          <p className="text-2xl font-bold text-primary">4</p>
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-6 md:min-h-min">
        <h2 className="text-xl font-semibold mb-4">{tDashboard('welcome')}</h2>
        <p className="text-muted-foreground mb-4">
          {tDashboard('connect_to_start')}
        </p>
        <div className="space-y-2">
          <h3 className="font-medium">{tDashboard('supported_networks')}</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>{tChains('ethereum')}</li>
            <li>{tChains('bsc')}</li>
            <li>{tChains('arbitrum')}</li>
            <li>{tChains('hashkey_chain')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
