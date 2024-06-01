"use client"
import { InvoiceStatusLabel } from '@/components/InvoiceStatusLabel'
import Link from 'next/link';
import { useChainId, useReadContract } from 'wagmi';
import { useEffect, useState } from 'react';
import { DownloadInvoiceButton } from './DownloadInvoiceButton';
import { DeleteInvoiceButton } from './DeleteInvoiceButton';
import { InvoicesView, formatAmount, isInvoiceData } from '@/invoice';
import { toast } from 'sonner';
import { invoiceHeroConfig } from '@/generated';
import { useLit } from '@/hooks/useLit';
import { decryptToString } from '@lit-protocol/lit-node-client';
import { config } from '@/wagmi';
import { fromHex, toHex } from 'viem';
import { SessionSigs } from "@lit-protocol/types";
import { readContract } from '@wagmi/core'

interface InvoiceListProps {
  address: `0x${string}`
  sessionSigs: SessionSigs;
}

export default function InvoiceList({
  address,
  sessionSigs,
}: InvoiceListProps) {
  const chainId = useChainId()
  const [isLoading, setIsLoading] = useState(true)
  const { litNodeClient } = useLit();
  const [invoices, setInvoices] = useState<InvoicesView[]>([])

  const { data, error: readError, isLoading: readIsLoading } = useReadContract({
    abi: invoiceHeroConfig.abi,
    address: invoiceHeroConfig.address[chainId as keyof typeof invoiceHeroConfig.address],
    functionName: 'balanceOf',
    args: [address],
  })

  const loading = isLoading || readIsLoading
  const error = readError

  function updateInvoice(id: string, newInvoiceData: InvoicesView) {
    setInvoices(prevInvoices => {
      const updatedInvoices = prevInvoices.map(invoice => {
        if (invoice.id === id) {
          return { ...invoice, ...newInvoiceData };
        }
        return invoice;
      });

      return updatedInvoices;
    });
  }

  useEffect(() => {
    async function getAndDecryptData() {
      if (!address || !litNodeClient) {
        console.error('No address or litNodeClient found')
        return
      }

      if (!sessionSigs) {
        console.error('cannot decrypt without sessionSigs')
        return
      }

      console.log('data: ', data)
      console.log('sessionSigs: ', sessionSigs)

      if (!data || !Number(data)) {
        console.error('No invoices found for address', address)
        return
      }

      setIsLoading(true)
      const invoices: InvoicesView[] = []

      const latestBlockhash = await litNodeClient.getLatestBlockhash();
      console.log("latestBlockhash:", latestBlockhash);

      for (let i = 0; i < Number(data); i++) {

        // get token id for the invoice i
        const id = await readContract(config, {
          abi: invoiceHeroConfig.abi,
          address: invoiceHeroConfig.address[chainId as keyof typeof invoiceHeroConfig.address],
          functionName: 'tokenOfOwnerByIndex',
          args: [address, BigInt(i)],
        })

        let ciphertext: string | `0x${string}` = ''
        let dataHash: string | `0x${string}` = ''
        try {
          // read the encrypted data from the contract
          const result = await readContract(config, {
            abi: invoiceHeroConfig.abi,
            address: invoiceHeroConfig.address[chainId as keyof typeof invoiceHeroConfig.address],
            functionName: 'getInvoiceData',
            args: [BigInt(i)],
          })
          console.log(result);
          ciphertext = fromHex(result[0], 'string');
          dataHash = fromHex(result[1], 'string');
        } catch (error) {
          console.error(error)
          continue
        }

        console.log('ciphertext: ', ciphertext)
        console.log('dataHash: ', dataHash)

        try {
          // Decrypt the data
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

          // -- Decrypt the encrypted string
          const decryptRes = await decryptToString(
            {
              accessControlConditions: accs,
              ciphertext: ciphertext,
              dataToEncryptHash: dataHash,
              sessionSigs: sessionSigs,
              chain: "base",
            },
            litNodeClient
          );

          console.log("✅ decryptRes:", decryptRes);
          const invoiceData = JSON.parse(decryptRes);
          if (!isInvoiceData(invoiceData)) {
            console.error('Invalid invoice data', invoiceData)
            continue
          }
          // validate if the decrypted data is a valid invoice data

          invoices.push({
            id: id.toString(),
            access: true,
            ...invoiceData
          })


        } catch (err) {
          console.error(err);
        }
        setInvoices(invoices)
        setIsLoading(false)
      }

    }

    if (data) {
      getAndDecryptData();
    }
  }, [data, address, litNodeClient, sessionSigs, chainId])

  useEffect(() => {
    if (error) {
      toast.error('Error fetching invoices')
      setIsLoading(false)
    }
  }, [error])

  const onDeleteInvoice = async (invoiceId: string) => {
    // optimistic update
    setInvoices(invoices.filter((invoice) => invoice.id !== invoiceId))
  }

  return (
    <>
      <div className="overflow-x-auto relative">
        <div className="mb-6 relative  shadow-md sm:rounded-lg overflow-hidden">
          <table className="w-full m-0 text-sm text-left ">
            <thead className="text-xs  uppercase ">
              <tr>
                <th scope="col" className="px-4 py-3">ID</th>
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
                  <tr key={data.id} className={'border-b'}>
                    <th scope="row" className="px-4 py-3 font-medium  whitespace-nowrap">
                      <Link href={`/invoice/${toHex(JSON.stringify(data))}`} className=" text-blue-600 hover:text-blue-700 hover:underline">
                        #{data.id}
                      </Link>
                    </th>
                    <th scope="row" className="px-4 py-3 font-medium  whitespace-nowrap">
                      {data.invoice_number}
                    </th>
                    <td className={`px-4 py-3 text-right ${data.access ? '' : 'blur'}`}>
                      <InvoiceStatusLabel status={data.status} />
                    </td>
                    <td className={`px-4 py-3 text-right ${data.access ? '' : 'blur'}`}>
                      <span className=''>
                        {data.client_display_name}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right ${data.access ? '' : 'blur'}`}>
                      <span className=''>
                        {new Date(data.creation_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right ${data.access ? '' : 'blur'}`}>
                      <span className=''>
                        {data.total && formatAmount(data.total, data.total_unit || 'USD')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-row items-stretch gap-2 justify-end">
                        <DownloadInvoiceButton data={data} />
                        <DeleteInvoiceButton tokenId={data.id} onDelete={onDeleteInvoice} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b">
                    <td colSpan={6} className="px-4 py-3">
                      {!loading && !invoices.length && <p className='mt-2'>No invoices found for {address}</p>}
                      {!error && loading && <p className='mt-2 animate-pulse'>Loading invoices...</p>}
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
