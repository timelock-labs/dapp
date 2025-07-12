
import React from 'react';
import EcosystemSearchHeader from './components/EcosystemSearchHeader';
import PartnersGrid from './components/PartnersGrid';
import PageLayout from '@/components/layout/PageLayout';

const EcosystemPage: React.FC = () => {
    const dummyPartners = [
        { id: 'aave', title: 'AAVE', description: 'Decentralized lending and borrowing protocol.', icon: '🏦', link: 'https://github.com/aave/arc-timelock' },
        { id: 'lido', title: 'Lido', description: 'Liquid staking solution for Ethereum.', icon: '🌊', link: 'https://github.com/lidofinance/dual-governance/blob/main/contracts/TimelockedGovernance.sol' },
        { id: 'eigenlayer', title: 'EigenLayer', description: 'Restaking protocol for Ethereum.', icon: '🌿', link: 'https://github.com/Layr-Labs/eigenlayer-contracts/tree/main' },
        { id: 'ethena', title: 'Ethena', description: 'Synthetic dollar protocol.', icon: '💵', link: 'https://github.com/ethena-labs/code4arena-contest/blob/7ffedb8873c2286930804e1c4feee0410fd0f033/protocols/USDe/lib/openzeppelin-contracts/contracts/mocks/compound/CompTimelock.sol#L70' },
        { id: 'uniswap', title: 'Uniswap', description: 'Decentralized exchange protocol.', icon: '🦄', link: 'https://github.com/Uniswap/governance' },
        { id: 'makerdao', title: 'MakerDAO', description: 'Decentralized autonomous organization behind DAI.', icon: '🏛️', link: 'https://github.com/makerdao/makerdao-status/blob/b41227fec8d87983daac5d593b8eaf02eff32e43/src/services/abi/compound/timelock.json#L4' },
        { id: 'morpho', title: 'Morpho', description: 'Optimized lending and borrowing protocol.', icon: '🦋', link: 'https://github.com/morpho-org/metamorpho/blob/00da9ad27da8051bce663eeac02f3b9c0c0aa8d8/src/interfaces/IMetaMorphoFactory.sol#L19' },
        { id: 'pendle', title: 'Pendle', description: 'Yield-trading protocol.', icon: '📈', link: 'https://github.com/pendle-finance/pendle-core/blob/master/contracts/periphery/Timelock.sol' },
        { id: 'compound', title: 'Compound', description: 'Decentralized lending protocol.', icon: '🏦', link: 'https://github.com/compound-finance/compound-protocol/blob/master/contracts/Timelock.sol' },
    ];

    return (
        <PageLayout title="Ecosystem">
            <div className="min-h-screen  ">
                <div className="mx-auto flex flex-col space-y-8 pt-4">
                    {/* Top Header Section */}
                    <EcosystemSearchHeader />

                    {/* Partners Grid Section */}
                    <PartnersGrid partners={dummyPartners} />
                </div>
            </div>
        </PageLayout>

    );
};

export default EcosystemPage;