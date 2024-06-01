"use client";
import { InvoiceTable } from './InvoiceTable'
import { InvoicesView } from '@/invoice'
import { fromHex } from 'viem';

export function InvoiceView({ data }: { data: `0x${string}` }) {
  const decData = JSON.parse(fromHex(data, 'string'))
  const invoice = {
    ...decData,
  } as InvoicesView;

  return (
    <>
      <div className={"relative p-4 border-2 border-gray-200 border-dashed rounded-lg"}>
        <InvoiceTable invoice={invoice} />
      </div>
    </>
  )
}

