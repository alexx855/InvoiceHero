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
