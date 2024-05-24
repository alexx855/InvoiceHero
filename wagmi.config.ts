import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'
import { isAddress } from 'viem';
import { base, foundry as foundryChain } from 'wagmi/chains'

let InvoiceHero: { [key: number]: `0x${string}` } = {
  [base.id]: '0x74CDBb00562a6d4B3Ff5A8f83edDddB04352083e'
};

if (process.env.NEXT_PUBLIC_ANVIL_CONTRACT_ADDRESS && isAddress(process.env.NEXT_PUBLIC_ANVIL_CONTRACT_ADDRESS)) {
  InvoiceHero[foundryChain.id] = process.env.NEXT_PUBLIC_ANVIL_CONTRACT_ADDRESS;
  console.log(`Using Anvil contract address: ${process.env.NEXT_PUBLIC_ANVIL_CONTRACT_ADDRESS}`);
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