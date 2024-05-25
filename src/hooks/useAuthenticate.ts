import { useCallback, useEffect, useState } from 'react';
import {
  isSignInRedirect,
  getProviderFromUrl,
} from '@lit-protocol/lit-auth-client';
import { AuthMethod } from '@lit-protocol/types';
import {
  authenticateWithGoogle,
  authenticateWithDiscord,
  authenticateWithEthWallet,
  authenticateWithWebAuthn,
} from '../lit';
import { useConnect } from 'wagmi';
import { useLit } from '@/hooks/useLit';
import { config } from '@/wagmi';
import { getEthersSigner } from '@/ethers';

export default function useAuthenticate(redirectUri?: string) {
  const { litAuthClient } = useLit();
  const [authMethod, setAuthMethod] = useState<AuthMethod>();
  const [loading, setLoading] = useState<boolean>(false);

  // wagmi hook
  const { connectAsync, error } = useConnect();

  /**
   * Handle redirect from Google OAuth
   */
  const authWithGoogle = useCallback(async (): Promise<void> => {
    setLoading(true);
    setAuthMethod(undefined);
    if (!litAuthClient) {
      return;
    }
    try {
      const result = (await authenticateWithGoogle(
        litAuthClient,
        // @ts-ignore
        redirectUri
      ));
      setAuthMethod(result);
    } catch (err) {
      console.error(err);
      // setError(new Error('Failed to authenticate with Google'));
    } finally {
      setLoading(false);
    }
  }, [litAuthClient, redirectUri]);

  /**
   * Handle redirect from Discord OAuth
   */
  const authWithDiscord = useCallback(async (): Promise<void> => {
    setLoading(true);
    // setError(undefined);
    setAuthMethod(undefined);
    if (!litAuthClient) {
      return;
    }
    try {
      const result = (await authenticateWithDiscord(
        litAuthClient,
        // @ts-ignore
        redirectUri
      ));
      setAuthMethod(result);
    } catch (err) {
      console.error(err);
      // setError(new Error('Failed to authenticate with Discord'));
    } finally {
      setLoading(false);
    }
  }, [litAuthClient, redirectUri]);

  /**
   * Authenticate with Ethereum wallet
   */
  const authWithEthWallet = useCallback(
    async (connector: any): Promise<void> => {
      setLoading(true);
      // setError(undefined);
      setAuthMethod(undefined);
      if (!litAuthClient) {
        return;
      }
      try {
        const { accounts, chainId } = await connectAsync(
          connector
        );
        // @ts-ignore
        const ethers = await getEthersSigner(config)
        const signer = await ethers.provider.getSigner();
        const signMessage = async (message: string) => {
          const sig = await signer.signMessage(message);
          return sig;
        };
        const result = await authenticateWithEthWallet(
          litAuthClient,
          accounts[0],
          signMessage
        );
        setAuthMethod(result);
      } catch (err) {
        console.error(err);
        // setError(err);
      } finally {
        setLoading(false);
      }
    },
    [litAuthClient, connectAsync]
  );

  /**
   * Authenticate with WebAuthn credential
   */
  const authWithWebAuthn = useCallback(
    async (username?: string): Promise<void> => {
      setLoading(true);
      // setError(undefined);
      setAuthMethod(undefined);
      if (!litAuthClient) {
        return;
      }
      try {
        const result = await authenticateWithWebAuthn(litAuthClient);
        setAuthMethod(result);
      } catch (err) {
        console.error(err);
        // setError(err);
      } finally {
        setLoading(false);
      }
    },
    [litAuthClient]
  );

  useEffect(() => {
    // Check if user is redirected from social login
    if (redirectUri && isSignInRedirect(redirectUri)) {
      // If redirected, authenticate with social provider
      const providerName = getProviderFromUrl();
      if (providerName === 'google') {
        authWithGoogle();
      } else if (providerName === 'discord') {
        authWithDiscord();
      }
    }
  }, [redirectUri, authWithGoogle, authWithDiscord]);

  return {
    authWithEthWallet,
    authWithWebAuthn,
    authMethod,
    loading,
    error,
  };
}
