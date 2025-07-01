import { createConfig, http } from 'wagmi'
import { mainnet, bsc, arbitrum, hashkey } from 'viem/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, bsc, arbitrum, hashkey],
  connectors: [
    // walletConnect({
    //   projectId: 'fb56ad0947acd3c1fb60e1cdcc3fba37',
    // }),
    coinbaseWallet({
      appName: 'Timelock UI',
      appLogoUrl: 'https://family.co/logo.png',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [hashkey.id]: http(),
  },
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
} 