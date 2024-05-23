'use client'

import { config } from '@/wagmi'
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi'
import { formatUnits } from 'viem'

function Account() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { data } = useBalance({
    address: account.address,
    config
  })
  const { chains, switchChain, isPending } = useSwitchChain()

  return (
    <>
      <div>
        <h2>Account</h2>
        status: {account.status}
        <hr />
        {account.status === 'connected' ? (
          <div>
            {chains.map((chain) => {
              if (chain.id === account.chainId) {
                return (
                  <button className='p-2 text-left' key={chain.id} disabled>
                    {chain.name} (active)
                  </button>
                )
              } else {
                return (
                  <button className='p-2 text-left' key={chain.id} onClick={() => switchChain({ chainId: chain.id })}>
                    Switch to {chain.name}
                    {isPending && ' (switching)'}
                  </button>
                )
              }
            })}
            <button type="button" onClick={() => disconnect()}>
              Disconnect
            </button>
            <hr />
            addresses: {JSON.stringify(account.addresses)}
            <hr />
            balance: {data && formatUnits(data?.value, 18)}
          </div>
        ) : (
          <div>
            <h3>Connect</h3>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                type="button"
              >
                {connector.name}
              </button>
            ))}
            <div>{status}</div>
            <div>{error?.message}</div>
          </div>
        )}
      </div>
    </>
  )
}

export default Account
