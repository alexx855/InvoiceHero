import { InvoiceTable } from './InvoiceTable'
import { Invoice } from '@/invoice'

export function InvoiceView({ invoice }: { invoice: Invoice }) {

  return (
    <>
      <div className="flex justify-between content-center">
        <h1 className="mb-4 mt-0 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Invoice <span className="text-blue-600">{invoice.id}</span></h1>
      </div>
      <div className={"relative p-4 border-2 border-gray-200 border-dashed rounded-lg"}>
        <InvoiceTable invoice={invoice} />
      </div>
    </>
  )
}

