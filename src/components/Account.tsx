'use client'

import { useAccount, useDisconnect, useSwitchChain } from 'wagmi'
import useAccounts from '@/hooks/useAccounts'
import { useRouter } from 'next/navigation'
import useSession from '@/hooks/useSession';

function Account() {
  const {
    fetchAccounts,
    setCurrentAccount,
    currentAccount,
    accounts,
    loading: accountsLoading,
    error: accountsError,
  } = useAccounts();
  const {
    initSession,
    sessionSigs,
    loading: sessionLoading,
    error: sessionError,
  } = useSession();

  const account = useAccount()
  const { disconnectAsync } = useDisconnect()
  // const { connectors, connect, status, error } = useConnect()
  // const { data } = useBalance({
  //   address: account.address,
  //   config
  // })
  const router = useRouter()
  const { chains, switchChain, isPending } = useSwitchChain()

  const logout = async () => {
    disconnectAsync();
    localStorage.removeItem('lit-wallet-sig');
    router.push('/');
  }

  return (
    <>
      <div>
        <span>{account.status}</span>
        {account.status === 'connected' && ( 
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
        )}
      </div>
    </>
  )
}

export default Account
