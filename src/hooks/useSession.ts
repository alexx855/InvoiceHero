import { useCallback, useState } from 'react';
import { AuthCallbackParams } from '@lit-protocol/types';
import { AuthSig, LitAbility, LitActionResource, LitPKPResource, createSiweMessageWithRecaps, generateAuthSig } from '@lit-protocol/auth-helpers';
import { IRelayPKP } from '@lit-protocol/types';
import { SessionSigs } from '@lit-protocol/types';
import { config } from '@/wagmi';
import { getEthersSigner } from '@/ethers';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { useLit } from "@/hooks/useLit";

export default function useSession() {
  const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const { litNodeClient } = useLit();

  const initSession = useCallback(
    async (pkp: IRelayPKP): Promise<void> => {
      setLoading(true);
      setError(undefined);
      console.log('initSession pkp: ', pkp);
      try {

        if (!litNodeClient) {
          throw new Error('Lit node client not found');
        }
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
        // // save session sigs to local storage
        // console.log('sessionSigs: ', sessionSigs        // console.log('saving session sigs to local storage');
        // localStorage.setItem('lit-wallet-sig', JSON.stringify(sessionSigs));
        // console.log(sessionSigs););


      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [litNodeClient]
  );

  return {
    initSession,
    sessionSigs,
    loading,
    error,
  };
}
