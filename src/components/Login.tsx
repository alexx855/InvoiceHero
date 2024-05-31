"use client";

import { useEffect } from 'react';
import useAuthenticate from '../hooks/useAuthenticate';
import useSession from '../hooks/useSession';
import useAccounts from '../hooks/useAccounts';
import Dashboard from './Dashboard';
import LoginMethods from './LoginMethods';
import AccountSelection from './AccountSelection';
import CreateAccount from './CreateAccount';
import { useLit } from '../hooks/useLit';
import { ORIGIN, signInWithDiscord, signInWithGoogle } from '@/lit';
import Loading from './Loading';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function Login() {
  const redirectUri = ORIGIN + '/login';
  const { litAuthClient, litNodeClient } = useLit();

  const {
    authMethod,
    authWithEthWallet,
    loading: authLoading,
    error: authError,
  } = useAuthenticate(redirectUri);
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
  const router = useRouter();
  const account = useAccount()

  useEffect(() => {
    console.log('account: ', account);
    console.log(account.status);
    // handle disconnect
    if (account.status === 'disconnected') {

    }
  }, [account, router])

  const error = authError || accountsError || sessionError;

  async function handleGoogleLogin() {
    if (!litAuthClient) return;
    await signInWithGoogle(litAuthClient, redirectUri);
  }

  async function handleDiscordLogin() {
    if (!litAuthClient) return;
    await signInWithDiscord(litAuthClient, redirectUri);
  }

  useEffect(() => {
    // If user is authenticated, fetch accounts
    console.log('authMethod: ', authMethod);
    if (authMethod) {
      // router.replace(window.location.pathname, undefined,);
      fetchAccounts(authMethod);
    }
  }, [authMethod, fetchAccounts, router]);
  useEffect(() => {
    // If user is authenticated and has selected an account, initialize session
    if (authMethod && currentAccount && litAuthClient && litNodeClient) {
      initSession(litNodeClient, litAuthClient, authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession, litAuthClient, litNodeClient]);

  if (!litAuthClient || !litNodeClient) {
    return <Loading copy={'Loading...'} error={error} />;
  }

  if (authLoading) {
    return (
      <Loading copy={'Authenticating your credentials...'} error={error} />
    );
  }

  if (accountsLoading) {
    return <Loading copy={'Looking up your accounts...'} error={error} />;
  }

  if (sessionLoading) {
    return <Loading copy={'Securing your session...'} error={error} />;
  }

  // If user is authenticated and has selected an account, initialize session
  if (account.status === 'connected' && currentAccount && sessionSigs) {
    return (
      <Dashboard currentAccount={currentAccount} sessionSigs={sessionSigs} />
    );
  }

  // If user is authenticated and has more than 1 account, show account selection
  if (account.status === 'connected' && authMethod && accounts.length > 0) {
    return (
      <AccountSelection
        accounts={accounts}
        setCurrentAccount={setCurrentAccount}
      />
    );
  }

  // If user is authenticated but has no accounts, prompt to create an account
  if (authMethod && accounts.length === 0) {
    return <CreateAccount authMethod={authMethod} error={error} onAccountCreated={setCurrentAccount} />;
  }

  // If user is not authenticated, show login methods
  return (
    <LoginMethods
      handleGoogleLogin={handleGoogleLogin}
      handleDiscordLogin={handleDiscordLogin}
      authWithEthWallet={authWithEthWallet}
      error={error}
    />
  );
}
