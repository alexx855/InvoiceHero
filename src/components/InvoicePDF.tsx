'use client'
import { type Invoice } from '@/invoice'
import { InvoiceTable } from './InvoiceTable'

export function InvoicePDF({ invoice }: { invoice: Invoice }) {

  return (
    <div className="p-10">
      <InvoiceTable invoice={invoice} />
    </div>
  )
}

