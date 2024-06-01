"use client"

import Link from "next/link";
import { useEffect } from "react";

export function ForceDownloadInvoice({ data }: { data: `0x${string}` }) {

  useEffect(() => {
    async function downloadInvoice() {
      const headers = new Headers()
      headers.append('Content-Disposition', 'attachment')

      const response = await fetch(`/api/pdf/${data}`, { headers })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `InvoiceHero.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    }
    downloadInvoice()
  }, [data])

  return <p><Link className=" text-blue-600 hover:text-blue-700 hover:underline" href={`/api/pdf/${data}?force_download`}>Click here</Link> if the download does not start automatically.</p>

}
