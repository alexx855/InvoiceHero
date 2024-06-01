"use client";

import { useLit } from "@/hooks/useLit";
import { mintPKP } from "@/lit";
import { useState } from "react";
import { AuthMethod, IRelayPKP } from "@lit-protocol/types";
import { toast } from "sonner";

interface CreateAccountProp {
  authMethod: AuthMethod;
  error?: Error;
  onAccountCreated: (pkp: IRelayPKP) => void;
}

export default function CreateAccount({
  authMethod,
  error,
  onAccountCreated,
}: CreateAccountProp) {
  const [loading, setLoading] = useState(false);
  const { litAuthClient } = useLit();

  const handleCreatePKP = async () => {
    setLoading(true);
    if (!litAuthClient) {
      console.error("Lit auth client not found");
      return;
    }
    try {
      const PKP = await mintPKP(litAuthClient, authMethod);
      toast.success("PKP created successfully");
      onAccountCreated(PKP);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create PKP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-2 h-full w-fit bg-gray-600 rounded-3xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50  p-5  ">
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
          <button
            type="button"
            onClick={() => handleCreatePKP()}
            disabled={loading}
            className="relative inline-flex mt-4 h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Create PKP
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
