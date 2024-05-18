'use client'

import { useState } from 'react'
import { InvoiceTable } from './InvoiceTable'
import Link from 'next/link'
import { INVOICE_MOCK } from '@/constants'
import { Invoice } from '@/invoice'

export function InvoiceView({ invoiceId }: { invoiceId: string }) {

  const [invoice, setInvoice] = useState<Invoice>({
    id: invoiceId,
    ...INVOICE_MOCK
  })

  const [locked, setLocked] = useState<boolean>(true)

  return (
    <>
      <div className="flex justify-between content-center">
        <h1 className="mb-4 mt-0 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Invoice <span className="text-blue-600">{invoiceId}</span></h1>
        <nav>
          <Link href={`/invoice/${invoiceId}/pdf`} className="text-blue-600 hover:text-blue-700 hover:underline">
            View PDF
          </Link>
          <Link href={`/invoice/${invoiceId}/download`} className="text-blue-600 hover:text-blue-700 hover:underline">
            Download PDF
          </Link>
        </nav>
      </div>
      <div className={locked ? "blur-sm animate-pulse animation-delay-1000" : "" + "relative p-4 border-2 border-gray-200 border-dashed rounded-lg"}>
        <InvoiceTable invoice={invoice} />
      </div>
    </>
  )
}

