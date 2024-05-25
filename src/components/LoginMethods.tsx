'use client'

import { useState } from 'react';
import AuthMethods from './AuthMethods';
import WalletMethods from './WalletMethods';
import WebAuthn from './WebAuthn';
import { AuthView } from '@/lit';

interface LoginProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  authWithEthWallet: any;
  authWithWebAuthn: any;
  signUp: any;
  error?: Error;
}


export default function LoginMethods({
  handleGoogleLogin,
  handleDiscordLogin,
  authWithEthWallet,
  authWithWebAuthn,
  signUp,
  error,
}: LoginProps) {
  const [view, setView] = useState<AuthView>('default');

  return (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        {view === 'default' && (
          <>
            <h1>Welcome back</h1>
            <p>Access your Lit wallet.</p>
            <AuthMethods
              handleGoogleLogin={handleGoogleLogin}
              handleDiscordLogin={handleDiscordLogin}
              setView={setView}
            />
            <div className="buttons-container">
              <button type="button" className="btn btn--link" onClick={signUp}>
                Need an account? Sign up
              </button>
            </div>
          </>
        )}
        {view === 'wallet' && (
          <WalletMethods
            authWithEthWallet={authWithEthWallet}
            setView={setView}
          />
        )}
        {view === 'webauthn' && (
          <WebAuthn
            start={'authenticate'}
            authWithWebAuthn={authWithWebAuthn}
            setView={setView}
          />
        )}
      </div>
    </div>
  );
}
