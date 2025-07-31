import React from 'react';
import { useTranslations } from 'next-intl';
import PageLayout from '@/components/layout/PageLayout';
import WalletSection from './WalletSection';
import HowTimelockWorks from './HowTimelockWorks';
import HowTimelockProtocol from './HowTimelockProtocol';
import FeatureCard from '@/components/ui/FeatureCard';

const CreateProtocol: React.FC = () => {
  const t = useTranslations('home_page');

  return (
    <PageLayout title={t('create_protocol_title')} >
      {/* Main Content Area */}
      <main className="container mx-auto">
        {/* First Row Component */}
        <div className="mb-12">
          <WalletSection />
        </div>
        {/* Second Row: How Timelock Works & How to Use Protocol */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <HowTimelockWorks />
          <HowTimelockProtocol />
        </div>
        {/* Third Row: Who is using it? and Feature Cards */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {t('whos_using.title')} <span className="text-gray-500 text-base font-normal">{t('whos_using.description')}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard title={t('feature_cards.aave.title')} description={t('feature_cards.aave.description')} icon="🏦" link="https://github.com/aave/arc-timelock" />
              <FeatureCard title={t('feature_cards.lido.title')} description={t('feature_cards.lido.description')} icon="🌊" link="https://github.com/lidofinance/dual-governance/blob/main/contracts/TimelockedGovernance.sol" />
              <FeatureCard title={t('feature_cards.eigenlayer.title')} description={t('feature_cards.eigenlayer.description')} icon="🌿" link="https://github.com/Layr-Labs/eigenlayer-contracts/tree/main" />
              <FeatureCard title={t('feature_cards.ethena.title')} description={t('feature_cards.ethena.description')} icon="💵" link="https://github.com/ethena-labs/code4arena-contest/blob/7ffedb8873c2286930804e1c4feee0410fd0f033/protocols/USDe/lib/openzeppelin-contracts/contracts/mocks/compound/CompTimelock.sol#L70" />
              <FeatureCard title={t('feature_cards.uniswap.title')} description={t('feature_cards.uniswap.description')} icon="🦄" link="https://github.com/Uniswap/governance" />
              <FeatureCard title={t('feature_cards.makerdao.title')} description={t('feature_cards.makerdao.description')} icon="🏛️" link="https://github.com/makerdao/makerdao-status/blob/b41227fec8d87983daac5d593b8eaf02eff32e43/src/services/abi/compound/timelock.json#L4" />
              <FeatureCard title={t('feature_cards.morpho.title')} description={t('feature_cards.morpho.description')} icon="🦋" link="https://github.com/morpho-org/metamorpho/blob/00da9ad27da8051bce663eeac02f3b9c0c0aa8d8/src/interfaces/IMetaMorphoFactory.sol#L19" />
              <FeatureCard title={t('feature_cards.pendle.title')} description={t('feature_cards.pendle.description')} icon="📈" link="https://github.com/pendle-finance/pendle-core/blob/master/contracts/periphery/Timelock.sol" />
              <FeatureCard title={t('feature_cards.compound.title')} description={t('feature_cards.compound.description')} icon="🏦" link="https://github.com/compound-finance/compound-protocol/blob/master/contracts/Timelock.sol" />
            </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default CreateProtocol
;