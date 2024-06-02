import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'
import { isAddress } from 'viem';
import { base, foundry as foundryChain } from 'wagmi/chains'

let InvoiceHero: { [key: number]: `0x${string}` } = {
  [base.id]: '0x5D842DB44175e9E5642D6636CF7C3Ee59474502A'
};

if (process.env.NEXT_PUBLIC_ANVIL_CONTRACT_ADDRESS && isAddress(process.env.NEXT_PUBLIC_ANVIL_CONTRACT_ADDRESS)) {
  InvoiceHero[foundryChain.id] = process.env.NEXT_PUBLIC_ANVIL_CONTRACT_ADDRESS as `0x${string}`;
}

export default defineConfig({
  out: 'src/generated.ts',
  plugins: [
    foundry({
      forge: {
        clean: true,
        build: true,
        rebuild: true,
      },
      deployments: {
        InvoiceHero,
      },
    }),
  ],
})