import { InvoiceDataItems, InvoiceData } from "./invoice"

export const ITEM_MOCK = {
  details: "Software Development",
  quantity: 3,
  rate: 30,
  amount: 30
} satisfies InvoiceDataItems

export const INVOICE_MOCK = {
  invoice_number: '0001',
  status: 'draft',
  client_display_name: "John Doe",
  creation_date: "2023-06-13",
  total: 90,
  total_unit: "USD",
  items: [ITEM_MOCK],
  due_date: undefined,
  customer_notes: "Thank you for your business! Please make payment within 30 days of the invoice date. If you have any questions or concerns, please don't hesitate to contact us.",
} satisfies InvoiceData


