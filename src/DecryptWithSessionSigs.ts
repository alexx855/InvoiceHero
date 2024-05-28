// const LitJsSdk = require("@lit-protocol/lit-node-client-nodejs");
// globalThis.crypto = require("node:crypto");
// const fs = require("fs");
// const ethers = require("ethers");
// const { SiweMessage } = require("siwe");
// const {
//   LitAccessControlConditionResource,
//   LitAbility,
// } = require("@lit-protocol/auth-helpers");

// const accessControlConditions = [
//   {
//     contractAddress: "",
//     standardContractType: "",
//     chain: "ethereum",
//     method: "eth_getBalance",
//     parameters: [":userAddress", "latest"],
//     returnValueTest: {
//       comparator: ">=",
//       value: "0",
//     },
//   },
// ];

// const getSessionSigs = async (litNodeClient) => {
//   // Create a new ethers.js Wallet instance
//   const wallet = new ethers.Wallet(process.env.YOUR_PRIVATE_KEY);

//   let nonce = await litNodeClient.getLatestBlockhash();

//   /**
//    * When the getSessionSigs function is called, it will generate a session key
//    * and sign it using a callback function. The authNeededCallback parameter
//    * in this function is optional. If you don't pass this callback,
//    * then the user will be prompted to authenticate with their wallet.
//    */
//   const authNeededCallback = async ({ chain, resources, expiration, uri }) => {
//     const domain = "localhost:3000";
//     const message = new SiweMessage({
//       domain,
//       address: wallet.address,
//       statement: "Sign a session key to use with Lit Protocol",
//       uri,
//       version: "1",
//       chainId: "1",
//       expirationTime: expiration,
//       resources,
//       nonce,
//     });
//     const toSign = message.prepareMessage();
//     const signature = await wallet.signMessage(toSign);

//     const authSig = {
//       sig: signature,
//       derivedVia: "web3.eth.personal.sign",
//       signedMessage: toSign,
//       address: wallet.address,
//     };

//     return authSig;
//   };

//   // Create an access control condition resource
//   const litResource = new LitAccessControlConditionResource("*");

//   const sessionSigs = await litNodeClient.getSessionSigs({
//     chain: "ethereum",
//     resourceAbilityRequests: [
//       {
//         resource: litResource,
//         ability: LitAbility.AccessControlConditionDecryption,
//       },
//     ],
//     authNeededCallback,
//   });
//   return sessionSigs;
// };

// const encrypt = async (dataToEncrypt, sessionSigs, litNodeClient) => {
//   const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
//     {
//       accessControlConditions: accessControlConditions,
//       sessionSigs,
//       chain: "ethereum",
//       dataToEncrypt,
//     },
//     litNodeClient
//   );
//   return {
//     ciphertext,
//     dataToEncryptHash,
//   };
// };

// const decrypt = async (
//   ciphertext,
//   dataToEncryptHash,
//   sessionSigs,
//   litNodeClient
// ) => {
//   return await LitJsSdk.decryptToString(
//     {
//       accessControlConditions: accessControlConditions,
//       ciphertext,
//       dataToEncryptHash,
//       sessionSigs,
//       chain: "ethereum",
//     },
//     litNodeClient
//   );
// };

// const main = async () => {
//   const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
//     litNetwork: "manzano",
//     debug: false,
//   });
//   await litNodeClient.connect();

//   const sessionSigs = await getSessionSigs(litNodeClient);

//   const encryptedData = await encrypt("meow", sessionSigs, litNodeClient);
//   console.log("encryptedData", encryptedData);

//   const decryptedData = await decrypt(
//     encryptedData.ciphertext,
//     encryptedData.dataToEncryptHash,
//     sessionSigs,
//     litNodeClient
//   );
//   console.log("decryptedData", decryptedData);
// };

// main()
//   .catch(console.error)
//   .finally(() => process.exit(0));