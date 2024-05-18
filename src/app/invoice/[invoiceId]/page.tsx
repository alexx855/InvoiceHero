import { InvoiceView } from "@/components/InvoiceView"

export default async function Page({ params }: { params: { invoiceId: string } }) {
  const { invoiceId } = params;
  return (
    <InvoiceView invoiceId={invoiceId} />
  )
}