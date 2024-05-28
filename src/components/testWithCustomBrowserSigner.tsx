import { LitNodeClient, decryptToString, encryptString } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";
import { LitPKPResource, LitActionResource, LitAccessControlConditionResource, createSiweMessageWithRecaps, generateAuthSig } from "@lit-protocol/auth-helpers";
import { LitAbility } from "@lit-protocol/types";
import { AuthCallbackParams } from "@lit-protocol/types";
import { ethers } from "ethers";
import { LitContracts } from "@lit-protocol/contracts-sdk";


export const DISCORD_REDIRECT_URI = "http://localhost:3001/lit";
const EOA_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

async function connectBrowserWallet() {
  if (typeof window.ethereum !== 'undefined') {
    // MetaMask or other provider is installed
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      return signer;
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  } else {
    throw new Error("Please install MetaMask or another Ethereum wallet provider.");
  }
}

export const testWithCustomBrowserSigner = async () => {
  console.log("🔥 LET'S GO!");
  const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.Cayenne,
  });

  console.log("Connecting to LitNode...");
  await litNodeClient.connect();


  const wallet = await connectBrowserWallet();
  if (!wallet) {
    throw new Error("No wallet connected");
  }
  const address = await wallet.getAddress();
  console.log("✅ browser wallet address:", address);

  const latestBlockhash = await litNodeClient.getLatestBlockhash();
  console.log("latestBlockhash:", latestBlockhash);

  // mint a pkp
  const litContracts = new LitContracts({
    signer: wallet,
    debug: false,
    network: LitNetwork.Cayenne,
  });

  await litContracts.connect();

  const pkp = (await litContracts.pkpNftContractUtils.write.mint()).pkp;
  console.log("✅ pkp:", pkp);

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
        walletAddress: address, // <-- using the signer address
        nonce: latestBlockhash,
        litNodeClient,
      });

      const authSig = await generateAuthSig({
        signer: wallet, // <-- using the signer
        toSign,
      });

      return authSig;
    },
  });

  console.log("✅ sessionSigs:", sessionSigs);

  // // -- executeJs
  // const executeJsRes = await litNodeClient.executeJs({
  //   code: `(async () => {
  //       const sigShare = await LitActions.signEcdsa({ 
  //         toSign: dataToSign,
  //         publicKey,
  //         sigName: "sig",
  //       });
  //     })();`,
  //   sessionSigs,
  //   jsParams: {
  //     dataToSign: ethers.utils.arrayify(
  //       ethers.utils.keccak256([1, 2, 3, 4, 5])
  //     ),
  //     publicKey: pkp.publicKey,
  //   },
  // });

  // console.log("✅ executeJsRes:", executeJsRes);

  // -- pkpSign
  const pkpSignRes = await litNodeClient.pkpSign({
    pubKey: pkp.publicKey,
    sessionSigs: sessionSigs,
    toSign: ethers.utils.arrayify(ethers.utils.keccak256([1, 2, 3, 4, 5])),
  });

  console.log("✅ pkpSignRes:", pkpSignRes);

  // -- encryptString
  const accs = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "base",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: address,
      },
    },
  ];

  const encryptRes = await encryptString(
    {
      accessControlConditions: accs,
      dataToEncrypt: "Hello world",
    },
    litNodeClient
  );

  console.log("✅ encryptRes:", encryptRes);

  // -- decrypt string
  const accsResourceString =
    await LitAccessControlConditionResource.generateResourceString(
      accs,
      encryptRes.dataToEncryptHash
    );

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
        walletAddress: address,
        nonce: latestBlockhash,
        litNodeClient,
      });

      const authSig = await generateAuthSig({
        signer: wallet,
        toSign,
      });

      return authSig;
    },
  });

  // -- Decrypt the encrypted string
  const decryptRes = await decryptToString(
    {
      accessControlConditions: accs,
      ciphertext: encryptRes.ciphertext,
      dataToEncryptHash: encryptRes.dataToEncryptHash,
      sessionSigs: sessionSigsToDecryptThing,
      chain: "base",
    },
    litNodeClient
  );

  console.log("✅ decryptRes:", decryptRes);
};
