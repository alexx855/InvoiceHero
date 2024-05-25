
"use client"
import { InvoiceStatusLabel } from '@/components/InvoiceStatusLabel'
import Link from 'next/link';
import { useAccount, useChainId, useReadContract } from 'wagmi';
import { useEffect, useState } from 'react';
import { DownloadInvoiceButton } from './DownloadInvoiceButton';
import { DeleteInvoiceButton } from './DeleteInvoiceButton';
import { Invoice, formatAmount } from '@/invoice';
import { toast } from 'sonner';
import { invoiceHeroConfig } from '@/generated';
import { INVOICE_MOCK } from '@/constants';

export function InvoiceList() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [invoices, setInvoices] = useState<Invoice[]>([])

  const { data, error, isLoading } = useReadContract({
    abi: invoiceHeroConfig.abi,
    address: invoiceHeroConfig.address[chainId as keyof typeof invoiceHeroConfig.address],
    functionName: 'balanceOf',
    args: [address!],
  })

  // create mock invoices for now
  useEffect(() => {
    if (data) {
      const invoices = [...Array(Number(data))].map((_, i) => ({
        ...INVOICE_MOCK,
        id: i.toString(),
        invoice_number: i.toString(),
      }))
      setInvoices(invoices)
    }
  }, [data])

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
          // open explorer tx with result
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
