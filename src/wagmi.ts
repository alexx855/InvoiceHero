import { LIT_CHAINS, LIT_CHAIN_RPC_URL, LitNetwork } from '@lit-protocol/constants';
import { defineChain, type Chain, type HttpTransport } from 'viem';
import { http, createConfig } from 'wagmi'
import { base, foundry } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

// export const lite = defineChain({
//   id: 175177,
//   nativeCurrency: {
//     decimals: 18,
//     name: 'LIT Token',
//     symbol: 'LIT',
//   },
//   name: "Chronicle - Lit Protocol Testnet",
//   rpcUrls: {
//     default: {
//       http: ["https://chain-rpc.litprotocol.com/http"],
//       // http: [LIT_CHAIN_RPC_URL],
//     },
//   },
// });

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
      // unstable_shimAsyncInject: true,
      // shimDisconnect: true,
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
