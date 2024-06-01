import { InvoicesView } from "@/invoice";
import Link from "next/link";
import { toHex } from "viem";

export function DownloadInvoiceButton({ data }: { data: InvoicesView }) {

  const hexData = toHex(JSON.stringify(data))

  return (data.access ? 
    <Link
      href={`/invoice/${hexData}/download`}
      target="_blank"
      className="p-2.5 m-0 rounded  cursor-pointer"
      aria-label="Download Invoice"
    >
      <span className="sr-only">Download Invoice</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    </Link>
    :
    <button
      disabled
      className="p-2.5 m-0 rounded blur"
      aria-label="Download Invoice"
    >
      <span className="sr-only">Download Invoice</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    </button>
  )
}
