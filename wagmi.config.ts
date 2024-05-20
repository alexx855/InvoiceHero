import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'
import { base, foundry as foundryChain } from 'wagmi/chains'

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
        InvoiceHero: {
          [base.id]: '0x74CDBb00562a6d4B3Ff5A8f83edDddB04352083e',
          [foundryChain.id]: process.env.NEXT_PUBLIC_FOUNDRY_CONTRACT_ADDRESS as `0x${string}`,
        },
      },
    }),
  ],
})