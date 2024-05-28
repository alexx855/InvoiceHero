import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";
import { LitPKPResource, LitActionResource } from "@lit-protocol/auth-helpers";
import { LitAbility } from "@lit-protocol/types";
import { AuthCallbackParams } from "@lit-protocol/types";
import { ethers } from "ethers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { GoogleProvider, LitAuthClient } from "@lit-protocol/lit-auth-client";
import {
  RELAY_URL_CAYENNE,
  ProviderType,
  LIT_CHAIN_RPC_URL,
} from "@lit-protocol/constants";

import { AuthMethodScope } from "@lit-protocol/constants";
const EOA_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";


export const testGoogleAuthMethod = async () => {
  console.log("testGoogleAuthMethod");

  const litNodeClient = new LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: LitNetwork.Cayenne,
    debug: true,
  });

  await litNodeClient.connect();

  /**
   * ========== Lit Auth Client ==========
   */
  const litAuthClient = new LitAuthClient({
    litRelayConfig: {
      relayUrl: RELAY_URL_CAYENNE,
      relayApiKey: "098f6bcd4621d373cade4e832627b4f6",
    },
    litNodeClient,
  });

  // -- get Google auth method
  const googleProvider = litAuthClient.initProvider<GoogleProvider>(
    ProviderType.Google
  );

  console.log("✅ googleProvider initialized!", googleProvider);

  /**
   * ========== Sign in Google ==========
   */
  // If ?provider=Google is not found in the URL, redirect to Google OAuth
  const url = new URL(window.location.href);
  if (url.searchParams.get("provider") !== "google") {
    console.log("Signing in with Google...");
    googleProvider.signIn();
  }

  /**
   * ========== Authenticate ==========
   */
  console.log("Google is signed in! Authenticating...");

  // Handle authentication
  const googleAuthMethod = await googleProvider.authenticate();
  console.log("✅ googleProvider googleAuthMethod:", googleAuthMethod);

  /**
   * ========== Lit Contracts SDK to create a capacity delegation authSig ==========
   */
  const rpcProvider = new ethers.providers.JsonRpcProvider(LIT_CHAIN_RPC_URL);

  const ethersWallet = new ethers.Wallet(EOA_PRIVATE_KEY, rpcProvider);

  const litContractsClient = new LitContracts({
    network: LitNetwork.Cayenne,
    signer: ethersWallet,
    debug: true,
  });

  await litContractsClient.connect();

  console.log("litContractsClient:", litContractsClient);

  const { capacityTokenIdStr } =
    await litContractsClient.mintCapacityCreditsNFT({
      requestsPerKilosecond: 100,
      daysUntilUTCMidnightExpiration: 2,
    });

  console.log("capacityTokenIdStr:", capacityTokenIdStr);

  const capacityDelegationAuthSig = await (
    await litNodeClient.createCapacityDelegationAuthSig({
      dAppOwnerWallet: ethersWallet,
      capacityTokenId: capacityTokenIdStr,
    })
  ).capacityDelegationAuthSig;

  console.log("capacityDelegationAuthSig:", capacityDelegationAuthSig);

  const googleAuthMethodOwnedPkp = (
    await litContractsClient.mintWithAuth({
      authMethod: googleAuthMethod,
      scopes: [AuthMethodScope.SignAnything],
    })
  ).pkp;

  console.log("googleAuthMethodOwnedPkp:", googleAuthMethodOwnedPkp);

  /**
   * ========== Get Session Sigs  ==========
   */
  console.log("Getting session sigs...");
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
    capacityDelegationAuthSig: capacityDelegationAuthSig,
    authNeededCallback: async (props: AuthCallbackParams) => {
      console.log("authNeededCallback props:", props);

      const response = await litNodeClient.signSessionKey({
        sessionKey: props.sessionKey,
        statement: props.statement || "Some custom statement.",
        authMethods: [googleAuthMethod],
        pkpPublicKey: googleAuthMethodOwnedPkp.publicKey,
        expiration: props.expiration,
        resources: props.resources,
        chainId: 1,
        resourceAbilityRequests: props.resourceAbilityRequests,
      });

      return response.authSig;
    },
  });

  console.log("✅ sessionSigs:", sessionSigs);

  /**
   * ========== pkp sign  ==========
   */
  console.log("PKP Signing...");
  const pkpRes = await litNodeClient.pkpSign({
    sessionSigs: sessionSigs,
    pubKey: googleAuthMethodOwnedPkp.publicKey,
    toSign: ethers.utils.arrayify(ethers.utils.keccak256([1, 2, 3, 4, 5])),
  });

  console.log("✅ pkpSign response:", pkpRes);
};
