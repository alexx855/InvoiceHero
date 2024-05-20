import { defineConfig } from '@wagmi/cli'
import { erc20Abi, erc721Abi } from 'viem'
import { foundry } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20Abi,
    }, {
      name: 'erc721',
      abi: erc721Abi,
    },
  ],
  plugins: [
    foundry({
      forge: {
        clean: true,
        build: true,
        rebuild: true,
      },
    }),
  ],
})