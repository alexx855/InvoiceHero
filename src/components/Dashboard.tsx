import { IRelayPKP, SessionSigs } from '@lit-protocol/types';
import { ethers } from 'ethers';
import { useState } from 'react';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { useRouter } from 'next/router';
import { useDisconnect } from 'wagmi';
import { useLit } from '@/hooks/useLit';

interface DashboardProps {
  currentAccount: IRelayPKP;
  sessionSigs: SessionSigs;
}

export default function Dashboard({
  currentAccount,
  sessionSigs,
}: DashboardProps) {
  const [message, setMessage] = useState<string>('Free the web!');
  const [signature, setSignature] = useState<string>();
  const [recoveredAddress, setRecoveredAddress] = useState<string>();
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const { litNodeClient } = useLit();

  const { disconnectAsync } = useDisconnect();
  const router = useRouter();

  /**
   * Sign a message with current PKP
   */
  async function signMessageWithPKP() {
    if (!litNodeClient) {
      throw new Error('Lit node client not found');
    }

    setLoading(true);

    try {
      const pkpWallet = new PKPEthersWallet({
        controllerSessionSigs: sessionSigs,
        pkpPubKey: currentAccount.publicKey,
        litNodeClient
      });
      await pkpWallet.init();

      const signature = await pkpWallet.signMessage(message);
      setSignature(signature);

      // Get the address associated with the signature created by signing the message
      const recoveredAddr = ethers.utils.verifyMessage(message, signature);
      setRecoveredAddress(recoveredAddr);
      console.log('recoveredAddr', recoveredAddr);

      // Check if the address associated with the signature is the same as the current PKP
      const verified =
        currentAccount.ethAddress.toLowerCase() === recoveredAddr.toLowerCase();
      setVerified(verified);
    } catch (err) {
      console.error(err);
      setError(err as any);
    }

    setLoading(false);
  }

  async function handleLogout() {
    try {
      await disconnectAsync();
    } catch (err) { }
    localStorage.removeItem('lit-wallet-sig');
    router.reload();
  }

  return (
    < >
      <div >
        <button
          onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h1>Ready for the open web</h1>
      <div >
        <p>My address: {currentAccount.ethAddress.toLowerCase()}</p>
      </div>
      <div >
        <div >
          <p>Test out your wallet by signing this message:</p>
          <p>{message}</p>
          <button
            onClick={signMessageWithPKP}
            disabled={loading}
            className={`btn ${signature ? (verified ? 'btn--success' : 'btn--error') : ''
              } ${loading && 'btn--loading'}`}
          >
            {signature ? (
              verified ? (
                <span>Verified ✓</span>
              ) : (
                <span>Failed x</span>
              )
            ) : (
              <span>Sign message</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
