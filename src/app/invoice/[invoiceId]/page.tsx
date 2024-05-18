import { InvoiceView } from "@/components/InvoiceView";
import { INVOICE_MOCK } from "@/constants";
import type { Invoice } from "@/invoice";

export default async function Page({ params }: { params: { invoiceId: string } }) {
  const invoice: Invoice = {
    id: params.invoiceId,
    ...INVOICE_MOCK
  }
  return (
    <InvoiceView invoice={invoice} />
  )
}