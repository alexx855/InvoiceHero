"use client"
import { InvoiceStatusLabel } from '@/components/InvoiceStatusLabel'
import Link from 'next/link';
import { useAccount, useChainId, useReadContract } from 'wagmi';
import { useEffect, useState } from 'react';
import { DownloadInvoiceButton } from './DownloadInvoiceButton';
import { DeleteInvoiceButton } from './DeleteInvoiceButton';
import { Invoice, formatAmount, getInvoicesList } from '@/invoice';
import { toast } from 'sonner';
import { invoiceHeroConfig } from '@/generated';
import { INVOICE_MOCK } from '@/constants';
import useSession from '@/hooks/useSession';
import { useLit } from '@/hooks/useLit';
import { getEthersSigner } from '@/ethers';
import { LitAccessControlConditionResource, LitAbility, createSiweMessageWithRecaps, generateAuthSig } from '@lit-protocol/auth-helpers';
import { decryptToString } from '@lit-protocol/lit-node-client';
import { AuthCallbackParams } from '@lit-protocol/types';
import { config } from '@/wagmi';

export function InvoiceList() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [isLoading, setIsLoading] = useState(true)
  const { litNodeClient } = useLit();
  const { initSession, sessionSigs, loading, error } = useSession()
  const [invoices, setInvoices] = useState<Invoice[]>([])

  const { data, error: readError, isLoading: readIsLoading } = useReadContract({
    abi: invoiceHeroConfig.abi,
    address: invoiceHeroConfig.address[chainId as keyof typeof invoiceHeroConfig.address],
    functionName: 'balanceOf',
    args: [address!],
  })
  console.log('data: ', data)
  console.log('error: ', error)
  console.log('address: ', address)
  console.log('isLoading: ', isLoading)

  // create mock invoices for now
  useEffect(() => {


    async function getAndDecryptData() {
      //  && sessionSigs
      if (!address || !litNodeClient) {
        console.error('No address or litNodeClient found')
        return
      }
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
      try {

        const invoices: Invoice[] = []

        if (!data || !sessionSigs) {
          console.log('No invoices found for address', address)
          // toast.error(`No invoices found for address ${address}`)
          // setInvoices([])
          // setIsLoading(false)
          return
        }

        // Decrypt data

        const invoicesOwned = [...Array(Number(data))].map((_, i) => ({
          id: i.toString(),
        }))

        for (let i = 0; i < invoicesOwned.length; i++) {
          // TODO:
          // console.log('data[i].ciphertext: ', data[i].ciphertext)
          // console.log('data[i].dataHash: ', data[i].dataHash)

          // try {
          //   // -- decrypt string
          //   const accsResourceString =
          //     await LitAccessControlConditionResource.generateResourceString(
          //       accs,
          //       data[i].dataHash
          //     );

          //   const latestBlockhash = await litNodeClient.getLatestBlockhash();
          //   console.log("latestBlockhash:", latestBlockhash);

          //   const signer = await getEthersSigner(config);
          //   const walletAddress = await signer.getAddress();

          //   const sessionSigsToDecryptThing = await litNodeClient.getSessionSigs({
          //     resourceAbilityRequests: [
          //       {
          //         resource: new LitAccessControlConditionResource(accsResourceString),
          //         ability: LitAbility.AccessControlConditionDecryption,
          //       },
          //     ],
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
          //   });

          //   // -- Decrypt the encrypted string
          //   const decryptRes = await decryptToString(
          //     {
          //       accessControlConditions: accs,
          //       ciphertext: data[i].ciphertext,
          //       dataToEncryptHash: data[i].dataHash,
          //       sessionSigs: sessionSigsToDecryptThing,
          //       chain: "base",
          //     },
          //     litNodeClient
          //   );

          //   console.log("✅ decryptRes:", decryptRes);

          //   invoices.push({
          //     id: data[i].tokenId,
          //     ...JSON.parse(decryptRes)
          //   })

          //   toast.success('Message decrypted successfully: ' + decryptRes);
          // } catch (err) {
          //   console.error(err);
          //   toast.error((err as Error)?.message || 'Failed to decrypt message');
          // }


          const invoice = {
            ...INVOICE_MOCK,
            id: i.toString(),
            invoice_number: i.toString(),
          }
          invoices.push(invoice)

        }

        setInvoices(invoices)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    if (data) {
      getAndDecryptData();
    }
  }, [data, address, litNodeClient, sessionSigs])

  useEffect(() => {
    if (error) {
      toast.error('Error fetching invoices')
    }
  }, [error])

  const onDeleteInvoice = async (invoiceId: string, result: `0x${string}`) => {
    toast.success(`Invoice ${invoiceId} deleted`, {
      action: {
        label: 'View explorer',
        onClick: () => {
          // TODO: open explorer tx with result
        }
      },
      duration: 10000
    })

    // optimistic update
    setInvoices(invoices.filter((invoice) => invoice.id !== invoiceId))
  }

  return (
    <>
      <div className="overflow-x-auto relative">
        <div className="mb-6 relative bg-white shadow-md sm:rounded-lg overflow-hidden">
          <table className="w-full m-0 text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">Invoice Number</th>
                <th scope="col" className="px-4 py-3 text-right">Status</th>
                <th scope="col" className="px-4 py-3 text-right">Client</th>
                <th scope="col" className="px-4 py-3 text-right">Date</th>
                <th scope="col" className="px-4 py-3 text-right">Total</th>
                <th scope="col" className="px-4 py-3 text-right w-[180px]">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.length ? (
                invoices.map((data, inv) =>
                (
                  <tr key={data.id} className="border-b">
                    <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      <Link href={`/invoice/${data.id}`} className=" text-blue-600 hover:text-blue-700 hover:underline">
                        #{data.invoice_number}
                      </Link>
                    </th>
                    <td className="px-4 py-3 text-right">
                      <InvoiceStatusLabel status={data.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className=''>
                        {data.client_display_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className=''>
                        {new Date(data.creation_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className=''>
                        {data.total && formatAmount(data.total, data.total_unit || 'USD')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-row items-stretch gap-2 justify-end">
                        <DownloadInvoiceButton tokenId={data.id} />
                        <DeleteInvoiceButton tokenId={data.id} onDelete={onDeleteInvoice} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b">
                    <td colSpan={6} className="px-4 py-3">
                    {!isConnected && <p className='mt-2'>Please connect your wallet to view your invoices</p>}
                      {isConnected && !invoices.length && <p className='mt-2'>No invoices found</p>}
                      {isConnected && isLoading && <p className='mt-2'>Loading...</p>}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
