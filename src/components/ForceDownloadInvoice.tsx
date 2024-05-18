"use client"

import Link from "next/link";
import { useEffect } from "react";
import { toHex } from "viem";

export function ForceDownloadInvoice({ tokenId }: { tokenId: string }) {

  useEffect(() => {
    downloadInvoice()
    async function downloadInvoice() {
      const headers = new Headers()
      headers.append('Content-Disposition', 'attachment')

      const response = await fetch(`/api/${tokenId}/pdf/?force_download`, { headers })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `InvoiceHero-${tokenId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    }
  }, [tokenId])


  return <p><Link className=" text-blue-600 hover:text-blue-700 hover:underline" href={`/api/${tokenId}/pdf?force_download`}>Click here</Link> if the download does not start automatically.</p>

}
