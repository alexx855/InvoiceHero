'use client'

import { config } from '@/wagmi'
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi'
import { formatUnits } from 'viem'
import useAccounts from '@/hooks/useAccounts'
import useAuthenticate from '@/hooks/useAuthenticate'

function Account() {
  const account = useAccount()
  const { currentAccount, loading, error } = useAccounts()
  // const { connectors, connect, status, error } = useConnect()
  const { disconnectAsync } = useDisconnect()
  // const { data } = useBalance({
  //   address: account.address,
  //   config
  // })
  const { chains, switchChain, isPending } = useSwitchChain()

  const logout = async () => {
    try {
      await disconnectAsync();
    } catch (err) { }
    localStorage.removeItem('lit-wallet-sig');
    // router.push('/login');
  }

  return (
    <>
      <div>
        <div>Status: {account.status}</div>
        <div>Wagmi address: {account.address} </div>
        {/* balance: {data && formatUnits(data?.value, 18)} */}
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
            <button type="button" onClick={() => logout()}>
              Disconnect
            </button>

          </div>
        ) : (
          <div>
              {/* <h3>Connect</h3>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                type="button"
              >
                {connector.name}
              </button>
            ))} */}
              {/* <div>{status}</div> */}
            <div>{error?.message}</div>
          </div>
        )}
      </div>
    </>
  )
}

export default Account
