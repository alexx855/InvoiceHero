"use client";
import { IRelayPKP } from '@lit-protocol/types';
import { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(event: any) {
    event.preventDefault();
    if (isLoading) {
      return;
    }
    if (!selectedValue) {
      toast.error('Please select an account');
      return;
    }
    const account = accounts[parseInt(selectedValue)];
    setIsLoading(true);
    setCurrentAccount(account);
  }

  return (
    <div>
      <div>
        <h1>Choose your account</h1>
        <p>Continue with one of your accounts.</p>
        <form onSubmit={handleSubmit} >
          <div >
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
          <button type="submit" >
            {isLoading ? 'Loading...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
