import { useCallback, useState } from 'react';
import { AuthCallbackParams, AuthMethod } from '@lit-protocol/types';
import { getSessionSigs } from '../lit';
import { AuthSig, LitAbility, LitActionResource, LitPKPResource, createSiweMessageWithRecaps, generateAuthSig } from '@lit-protocol/auth-helpers';
import { IRelayPKP } from '@lit-protocol/types';
import { SessionSigs } from '@lit-protocol/types';
import { LitAuthClient } from '@lit-protocol/lit-auth-client';
import { config } from '@/wagmi';
import { getEthersSigner } from '@/ethers';
import { Signer } from 'ethers';
import { LitNodeClient } from '@lit-protocol/lit-node-client';

export default function useSession() {
  const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  /**
  * This function loads the capacityDelegationAuthSig from an environment variable.
  * For production use, it is recommended to replace this static implementation
  * with a call to a secure backend API that provides the signature.
  */
  const generateCapacityDelegationAuthSig = (): AuthSig => {
    const delegationAuthSig = process.env.NEXT_PUBLIC_CAPACITY_DELEGATION_AUTH_SIG;
    if (!delegationAuthSig) {
      throw new Error('CAPACITY_DELEGATION_AUTH_SIG environment variable is not set');
    }
    return JSON.parse(delegationAuthSig);
  };

  /**
   * Generate session sigs and store new session data
   */
  const initSession = useCallback(
    async (litNodeClient: LitNodeClient, litAuthClient: LitAuthClient, authMethod: AuthMethod, pkp: IRelayPKP): Promise<void> => {
      setLoading(true);
      setError(undefined);
      console.log('initSession pkp: ', pkp);
      try {
        // Prepare session sigs params
        const chain = 'ethereum';
        const resourceAbilities = [
          {
            resource: new LitActionResource('*'),
            ability: LitAbility.PKPSigning,
          },
        ];
        const expiration = new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 7
        ).toISOString(); // 1 week

        // Get capacityDelegationAuthSig generated from a wallet with the Capacity Credit NFT to pay for the session
        // const capacityDelegationAuthSig = generateCapacityDelegationAuthSig();

        // Generate session sigs
        // const sessionSigs = await getSessionSigs({
        //   litAuthClient,
        //   pkpPublicKey: pkp.publicKey,
        //   authMethod,
        //   sessionSigsParams: {
        //     chain,
        //     expiration,
        //     resourceAbilityRequests: resourceAbilities,
        //     authNeededCallback: async (params: AuthCallbackParams) => {
        //       if (!params.uri) {
        //         throw new Error("uri is required");
        //       }
        //       if (!params.expiration) {
        //         throw new Error("expiration is required");
        //       }

        //       if (!params.resourceAbilityRequests) {
        //         throw new Error("resourceAbilityRequests is required");
        //       }

        //       const signer = await getEthersSigner(config);
        //       const walletAddress = await signer.getAddress();
        //       console.log('walletAddress:', walletAddress);

        //       const latestBlockhash = await litNodeClient.getLatestBlockhash();
        //       console.log("latestBlockhash:", latestBlockhash);

        //       const toSign = await createSiweMessageWithRecaps({
        //         uri: params.uri,
        //         expiration: params.expiration,
        //         resources: params.resourceAbilityRequests,
        //         walletAddress,
        //         nonce: latestBlockhash,
        //         litNodeClient,
        //       });

        //       const authSig = await generateAuthSig({
        //         signer,
        //         toSign,
        //       });

        //       return authSig;
        //     },

        //   },
        // });

        const latestBlockhash = await litNodeClient.getLatestBlockhash();
        console.log("latestBlockhash:", latestBlockhash);

        const signer = await getEthersSigner(config);
        const walletAddress = await signer.getAddress();

        const sessionSigs = await litNodeClient.getSessionSigs({
          resourceAbilityRequests: [
            {
              resource: new LitPKPResource("*"),
              ability: LitAbility.PKPSigning,
            },
            {
              resource: new LitActionResource("*"),
              ability: LitAbility.LitActionExecution,
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
              walletAddress, // <-- using the signer address
              nonce: latestBlockhash,
              litNodeClient,
            });

            const authSig = await generateAuthSig({
              signer, // <-- using the signer
              toSign,
            });

            return authSig;
          },
        });


        setSessionSigs(sessionSigs);
      } catch (err) {
        console.error(err);
        // setError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    initSession,
    sessionSigs,
    loading,
    error,
  };
}
