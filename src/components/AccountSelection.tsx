"use client";
import { IRelayPKP } from "@lit-protocol/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AccountSelectionProp {
  accounts: IRelayPKP[];
  setCurrentAccount: any;
}

export default function AccountSelection({
  accounts,
  setCurrentAccount,
}: AccountSelectionProp) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  async function handleSubmit(event: any) {
    event.preventDefault();
    if (!selectedValue) {
      toast.error("Please select an account");
      return;
    }
    const account = accounts[parseInt(selectedValue)];
    return setCurrentAccount(account);
  }

  return (
    <div>
      <div className=" flex flex-col items-center justify-center gap-2 h-full w-fit bg-gray-600 rounded-3xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50  p-5  ">
        <h1 className=" font-bold text-2xl">Choose your account</h1>
        <p>Continue with one of your accounts.</p>
        <form onSubmit={handleSubmit}>
          <div>
            {accounts.map((account, index) => (
              <div key={`account-${index}`}>
                <input
                  type="radio"
                  name="accountSelection"
                  value={index.toString()}
                  id={account.ethAddress}
                  onChange={(e) => setSelectedValue(e.target.value)}
                />
                <label htmlFor={account.ethAddress}>
                  {account.ethAddress.toLowerCase()}
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="relative inline-flex h-12 mt-2 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Continue
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
