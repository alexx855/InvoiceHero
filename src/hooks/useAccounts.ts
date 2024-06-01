import { useCallback, useEffect, useState } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { getPKPs, mintPKP } from '../lit';
import { IRelayPKP } from '@lit-protocol/types';
import { useLit } from '@/hooks/useLit';

export default function useAccounts() {
  const [accounts, setAccounts] = useState<IRelayPKP[]>([]);
  const [currentAccount, setCurrentAccount] = useState<IRelayPKP>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const { litAuthClient } = useLit();

  /**
   * Restore accounts from local storage
   */
  useEffect(() => {
    const storedAccount = localStorage.getItem('lit-wallet-account');
    console.log('storedAccount: ', storedAccount);
    if (storedAccount) {
      const account = JSON.parse(storedAccount);
      if (account) {
        console.log('restoring pkp: ', account);
        setAccounts(prev => [...prev, account.pkp]);
        setCurrentAccount(account.pkp);
      }
    }
  }, [litAuthClient]);

  /**
   * Fetch PKPs tied to given auth method
   */
  const fetchAccounts = useCallback(
    async (authMethod: AuthMethod): Promise<void> => {
      if (!litAuthClient) {
        throw new Error('Lit auth client not found');
      }

      setLoading(true);
      setError(undefined);
      try {
        // Fetch PKPs tied to given auth method
        const myPKPs = await getPKPs(litAuthClient, authMethod);
        console.log('fetchAccounts pkps: ', myPKPs);
        setAccounts(myPKPs);

        // If only one PKP, set as current account
        if (myPKPs.length === 1) {
          setCurrentAccount(myPKPs[0]);
          console.log('setting current account', myPKPs[0]);
          // localStorage.setItem('lit-wallet-account', JSON.stringify({
          //   authMethod: authMethod,
          //   pkp: myPKPs[0],
          // }));

        }
      } catch (err) {
        console.error(err);
        setError(new Error('Failed to fetch accounts'));
      } finally {
        setLoading(false);
      }
    },
    [litAuthClient]
  );

  /**
   * Mint a new PKP for current auth method
   */
  const createAccount = useCallback(
    async (authMethod: AuthMethod): Promise<void> => {
      if (!litAuthClient) {
        throw new Error('Lit auth client not found');
      }

      setLoading(true);
      setError(undefined);
      try {
        const newPKP = await mintPKP(litAuthClient, authMethod);
        // console.log('createAccount pkp: ', newPKP);
        setAccounts(prev => [...prev, newPKP]);
        setCurrentAccount(newPKP);

        // localStorage.setItem('lit-wallet-account', JSON.stringify({
        //   authMethod: authMethod,
        //   pkp: newPKP,
        // }));

      } catch (err) {
        console.error(err);
        // setError(err);
      } finally {
        setLoading(false);
      }
    },
    [litAuthClient]
  );

  return {
    fetchAccounts,
    createAccount,
    setCurrentAccount,
    accounts,
    currentAccount,
    loading,
    error,
  };
}
