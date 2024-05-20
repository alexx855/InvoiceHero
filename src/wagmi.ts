import { http, createConfig } from 'wagmi'
import { base, foundry } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, foundry],
  connectors: [
    injected(),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
    [foundry.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
