
import { ForceDownloadInvoice } from "@/components/ForceDownloadInvoice"

export default async function Page({ params }: { params: { invoiceId: string } }) {
  return (
    <section className="text-center">
      <p>Your download will start shortly...</p>
      <ForceDownloadInvoice tokenId={params.invoiceId} />
    </section>
  )
}
