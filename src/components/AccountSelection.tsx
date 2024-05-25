import { IRelayPKP } from '@lit-protocol/types';
import { useState } from 'react';

interface AccountSelectionProp {
  accounts: IRelayPKP[];
  setCurrentAccount: any;
  error?: Error;
}

export default function AccountSelection({
  accounts,
  setCurrentAccount,
  error,
}: AccountSelectionProp) {
  const [selectedValue, setSelectedValue] = useState<string>('0');

  async function handleSubmit(event: any) {
    event.preventDefault();
    const account = accounts[parseInt(selectedValue)];
    return setCurrentAccount(account);
  }

  return (
    <div >
      <div >
        {error && (
          <div >
            <p>{error.message}</p>
          </div>
        )}
        <h1>Choose your account</h1>
        <p>Continue with one of your accounts.</p>
        <form onSubmit={handleSubmit} >
          <div >
            {accounts.map((account, index) => (
              <div
                key={`account-${index}`}
              >
                <input
                  type="radio"
                  value={index.toString()}
                  id={account.ethAddress}
                  onChange={(e) => setSelectedValue(e.target.value)}
                />
                <span >
                  <label
                    htmlFor={account.ethAddress}
                  >
                    {account.ethAddress.toLowerCase()}
                  </label>
              </div>
            ))}
          </div>
          <button type="submit" >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
