
import { ForceDownloadInvoice } from "@/components/ForceDownloadInvoice"

export default async function Page({ params }: { params: { data: `0x${string}` } }) {
  return (
    <section className="text-center w-full min-h-screen flex flex-col justify-center items-center">
      <p>Your download will start shortly...</p>
      <ForceDownloadInvoice data={params.data} />
    </section>
  )
}
