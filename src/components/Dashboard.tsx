"use client";
import { AuthCallbackParams, EncryptResponse, IRelayPKP, SessionSigs } from '@lit-protocol/types';
import { ethers } from 'ethers';
import { useState } from 'react';
import { LitAccessControlConditionResource, createSiweMessageWithRecaps, generateAuthSig } from "@lit-protocol/auth-helpers";
import { useAccount, useDisconnect } from 'wagmi';
import { useLit } from '@/hooks/useLit';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { decryptToString, encryptString } from '@lit-protocol/lit-node-client';
import { LitAbility } from "@lit-protocol/types";
import { getEthersSigner } from '@/ethers';
import { config } from '@/wagmi';
import { INVOICE_MOCK } from '@/constants';

interface DashboardProps {
  currentAccount: IRelayPKP;
  sessionSigs: SessionSigs;
}

export default function Dashboard({
  currentAccount,
  sessionSigs,
}: DashboardProps) {
  const [encryptedData, setEncryptedData] = useState<EncryptResponse>();
  const [signature, setSignature] = useState<string>();
  const [recoveredAddress, setRecoveredAddress] = useState<string>();
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { litNodeClient } = useLit();

  const { disconnectAsync } = useDisconnect();
  const router = useRouter();
  const account = useAccount()
  // /**
  //  * Sign a message with current PKP
  //  */
  // async function signMessageWithPKP() {
  //   if (!litNodeClient) {
  //     throw new Error('Lit node client not found');
  //   }

  //   setLoading(true);

  //   try {
  //     // -- pkpSign
  //     const pkpSignRes = await litNodeClient.pkpSign({
  //       pubKey: currentAccount.publicKey,
  //       sessionSigs: sessionSigs,
  //       toSign: ethers.utils.arrayify(ethers.utils.keccak256([1, 2, 3, 4, 5])),
  //     });

  //     console.log("✅ pkpSignRes:", pkpSignRes);

  //     const signature = pkpSignRes.signature;

  //     setSignature(signature);

  //     // Get the address associated with the signature created by signing the message
  //     const recoveredAddr = ethers.utils.verifyMessage(message, signature);
  //     setRecoveredAddress(recoveredAddr);
  //     console.log('recoveredAddr', recoveredAddr);

  //     // Check if the address associated with the signature is the same as the current PKP
  //     const verified =
  //       currentAccount.ethAddress.toLowerCase() === recoveredAddr.toLowerCase();
  //     setVerified(verified);
  //   } catch (err: unknown) {
  //     console.error(err);
  //     toast.error((err as Error)?.message || 'Failed to sign message');
  //   }

  //   setLoading(false);
  // }

  const accs = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "base",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: account.address,
      },
    },
  ];


  const handleEncryptMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!litNodeClient) {
      throw new Error('Lit node client not found');
    }

    try {
      // -- encrypt string
      const encryptRes = await encryptString(
        {
          accessControlConditions: accs,
          dataToEncrypt: JSON.stringify(INVOICE_MOCK),
        },
        litNodeClient
      );

      console.log("✅ encryptRes:", encryptRes);
      setEncryptedData(encryptRes);
      toast.success('Message encrypted successfully');
    } catch (err) {
      console.error(err);
      toast.error((err as Error)?.message || 'Failed to encrypt message');
    }
  }

  const handleDecryptMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!litNodeClient) {
      throw new Error('Lit node client not found');
    }
    if (!encryptedData) {
      throw new Error('No encrypted data found');
    }

    try {
      // -- decrypt string
      const accsResourceString =
        await LitAccessControlConditionResource.generateResourceString(
          accs,
          encryptedData.dataToEncryptHash
        );

      const latestBlockhash = await litNodeClient.getLatestBlockhash();
      console.log("latestBlockhash:", latestBlockhash);

      const signer = await getEthersSigner(config);
      const walletAddress = await signer.getAddress();

      const sessionSigsToDecryptThing = await litNodeClient.getSessionSigs({
        resourceAbilityRequests: [
          {
            resource: new LitAccessControlConditionResource(accsResourceString),
            ability: LitAbility.AccessControlConditionDecryption,
          },
        ],
        authNeededCallback: async (params: AuthCallbackParams) => {
          if (!params.uri) {
            throw new Error("uri is required");
          }
          if (!params.expiration) {
            throw new Error("expiration is required");
          }

          if (!params.resourceAbilityRequests) {
            throw new Error("resourceAbilityRequests is required");
          }

          const toSign = await createSiweMessageWithRecaps({
            uri: params.uri,
            expiration: params.expiration,
            resources: params.resourceAbilityRequests,
            walletAddress,
            nonce: latestBlockhash,
            litNodeClient,
          });

          const authSig = await generateAuthSig({
            signer,
            toSign,
          });

          return authSig;
        },
      });

      // -- Decrypt the encrypted string
      const decryptRes = await decryptToString(
        {
          accessControlConditions: accs,
          ciphertext: encryptedData.ciphertext,
          dataToEncryptHash: encryptedData.dataToEncryptHash,
          sessionSigs: sessionSigsToDecryptThing,
          chain: "base",
        },
        litNodeClient
      );

      console.log("✅ decryptRes:", decryptRes);
      toast.success('Message decrypted successfully: ' + decryptRes);
    } catch (err) {
      console.error(err);
      toast.error((err as Error)?.message || 'Failed to decrypt message');
    }
  }

  return (
    < >
      <h1>Ready for the open web</h1>
      <div >
        <p>Lit address: {currentAccount.ethAddress.toLowerCase()}</p>
      </div>
      <div >
        {/* <div >
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
        </div> */}
        <hr />
        <form>
          {/* <label>
            Message:
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label> */}
          <button className='mr-2' title='encrypt' onClick={handleEncryptMessage} type='button'>encrypt</button>
          <button title='decrypt' disabled={!encryptedData} onClick={handleDecryptMessage} type='button'>decrypt</button>
        </form>
        <hr />
      </div>
    </>
  );
}
