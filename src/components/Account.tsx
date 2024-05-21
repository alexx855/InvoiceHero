'use client'

import { config } from '@/wagmi'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { formatUnits } from 'viem'

function Account() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { data } = useBalance({
    address: account.address,
    config
  })

  return (
    <>
      <div>
        <h2>Account</h2>
        <div>
          status: {account.status}
          <hr />
          addresses: {JSON.stringify(account.addresses)}
          <hr />
          chainId: {account.chainId}
          <hr />
          balance: {data && formatUnits(data?.value, 18)}
        </div>
        {account.status === 'connected' ? (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
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
