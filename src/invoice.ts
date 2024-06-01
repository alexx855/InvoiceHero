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
export interface InvoicesView extends InvoiceData {
  id: string;
  access: boolean;
}

export function isInvoiceData(obj: any): obj is InvoiceData {
  return 'invoice_number' in obj && typeof obj.invoice_number === 'string'
    && 'status' in obj && typeof obj.status === 'string'
    && 'client_display_name' in obj && typeof obj.client_display_name === 'string'
    && 'creation_date' in obj && typeof obj.creation_date === 'string'
    && 'total' in obj && typeof obj.total === 'number'
    && 'total_unit' in obj && typeof obj.total_unit === 'string'
    && 'items' in obj && Array.isArray(obj.items)
    && (!obj.due_date || typeof obj.due_date === 'string')
    && (!obj.customer_notes || typeof obj.customer_notes === 'string');
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