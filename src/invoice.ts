import { createPublicClient, http } from "viem"

import { base, foundry } from "viem/chains"

export type InvoiceStatus = "draft" | "sent" | "paid" | "void"

export interface InvoiceDataItems {
  details: string
  quantity: number
  rate: number
  amount: number
}
export interface InvoiceData {
  invoice_number: string;
  status: InvoiceStatus;
  client_display_name: string;
  creation_date: string;
  total: number;
  total_unit: string;
  items: InvoiceDataItems[]
  due_date?: string;
  customer_notes?: string;
}
export interface Invoice extends InvoiceData {
  id: string;
}

export const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export interface InvoiceEncryptedData {
  tokenId: string;
  ciphertext: `0x${string}`;
  dataHash: `0x${string}`;
}

export const getInvoicesList = (address: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices/owner/${address}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store',
    method: 'POST',
  })
    .then(res => res.json())
    .then(res => (res as any).data)
    .catch(err => {
      console.log(err)
    })
}

export const getInvoice = async (tokenId: string, authSig: `0x${string}`) => {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices/${tokenId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authSig
    },
    cache: 'no-store',
    body: authSig,
    method: 'POST'
  })
    .then(res => res.json())
    .then(res => (res as any).data)
    .catch(err => {
      console.log(err)
    })
}

export const chain = process.env.NODE_ENV === 'development' ? foundry : base
export const createClient = () => {

  const client = createPublicClient({
    chain,
    transport: http()
  })

  return client
}