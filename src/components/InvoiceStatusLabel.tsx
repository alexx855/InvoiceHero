import type { InvoiceStatus } from "@/invoice"

export const InvoiceStatusLabel = ({ status }: { status: InvoiceStatus }) => {
  switch (status) {
    case 'draft':
      return (
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Draft</span>
      )
    case 'sent':
      return (
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Sent</span>
      )
    case 'paid':
      return (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Paid</span>
      )
    default:
      return (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{status}</span>
      )
  }
}
