"use client";

import { useLit } from "@/hooks/useLit";
import { mintPKP } from "@/lit";
import { useState } from "react";
import { AuthMethod, IRelayPKP } from '@lit-protocol/types';
import { toast } from "sonner";

interface CreateAccountProp {
  authMethod: AuthMethod;
  error?: Error;
  onAccountCreated: (pkp: IRelayPKP) => void;
}

export default function CreateAccount({ authMethod, error, onAccountCreated }: CreateAccountProp) {
  const [loading, setLoading] = useState(false);
  const { litAuthClient } = useLit();

  const handleCreatePKP = async () => {
    setLoading(true);
    if (!litAuthClient) {
      console.error('Lit auth client not found');
      return;
    }
    try {
      const PKP = await mintPKP(litAuthClient, authMethod);
      toast.success('PKP created successfully');
      onAccountCreated(PKP);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create PKP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>
        {error && (
          <div>
            <p>{error.message}</p>
          </div>
        )}

        {loading && <div>Loading...</div>}
        <h1>Need a PKP?</h1>
        <p>
          There doesn&apos;t seem to be a Lit wallet associated with your
          credentials. Create one today.
        </p>
        <div>
          <button onClick={() => handleCreatePKP()} disabled={loading}>
            Create PKP
          </button>
        </div>
      </div>
    </div>
  );
}
