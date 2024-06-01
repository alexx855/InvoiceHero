"use client";

import { useState } from "react";
import AuthMethods from "./AuthMethods";
import WalletMethods from "./WalletMethods";
import WebAuthn from "./WebAuthn";
import { AuthView } from "@/lit";

interface LoginProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  authWithEthWallet: any;
  error?: Error;
}

export default function LoginMethods({
  handleGoogleLogin,
  handleDiscordLogin,
  authWithEthWallet,
  error,
}: LoginProps) {
  const [view, setView] = useState<AuthView>("default");

  return (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        {view === "default" && (
          <>
            <p className="mb-4 mt-2">Access your account</p>
            <AuthMethods
              handleGoogleLogin={handleGoogleLogin}
              handleDiscordLogin={handleDiscordLogin}
              setView={setView}
            />
          </>
        )}
        {view === "wallet" && (
          <WalletMethods
            authWithEthWallet={authWithEthWallet}
            setView={setView}
          />
        )}
      </div>
    </div>
  );
}
