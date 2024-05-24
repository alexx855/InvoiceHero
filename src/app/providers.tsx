'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { Toaster } from 'sonner';
import { config } from '@/wagmi'
import { LitProvider } from '@/contexts/LitProvider';
import { LitNodeClientConfig } from '@lit-protocol/types';
import { LitNetwork } from "@lit-protocol/constants";

const litClientConfig: LitNodeClientConfig = {
  alertWhenUnauthorized: false,
  litNetwork: LitNetwork.Cayenne,
  debug: true,
};

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <LitProvider clientConfig={litClientConfig}>
        <QueryClientProvider client={queryClient}>
          {props.children}
          <Toaster />
        </QueryClientProvider>
      </LitProvider>
    </WagmiProvider>
  )
}
