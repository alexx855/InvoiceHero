import { InvoicePDF } from "@/components/InvoicePDF";
import { InvoiceTable } from "@/components/InvoiceTable";
import { InvoiceView } from "@/components/InvoiceView";
import { getInvoice } from "@/invoice";

// This is the page that will be rendered for the route /invoices/[invoiceId]/pdf (e.g. /invoices/1/pdf) 
export default async function Page({
  params,
  searchParams,
}: {
  params: { invoiceId: string }
  searchParams: { authSig: `0x${string}` }
}) {
  const { invoiceId } = params;
  const { authSig } = searchParams;
  const invoice = await getInvoice(invoiceId, authSig);
  if (!invoice) return (<div>Invoice not found</div>)
  return (
    <InvoicePDF invoice={invoice} />
  )
}