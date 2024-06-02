import { type Chain, type HttpTransport } from 'viem';
import { http, createConfig } from 'wagmi'
import { base, foundry } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

let chains: [Chain, ...Chain[]] = [base];
let transports: Record<number, HttpTransport> = {
  [base.id]: http(),
};

if (!isProduction) {
  chains.push(foundry);
  transports[foundry.id] = http();
}

export const config = createConfig({
  chains,
  connectors: [
    injected({
      unstable_shimAsyncInject: true,
      shimDisconnect: true,
    }),
  ],
  ssr: true,
  transports: transports
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
