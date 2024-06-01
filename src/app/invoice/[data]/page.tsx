import { InvoiceView } from "@/components/InvoiceView";

export default async function Page({ params }: { params: { data: `0x${string}` } }) {
  return (
    <InvoiceView data={params.data} />
  )
}