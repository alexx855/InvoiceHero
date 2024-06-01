import { InvoicesView } from "@/invoice"
import { NextRequest, NextResponse } from "next/server"
import puppeteer from 'puppeteer'
import { fromHex } from "viem"

export async function GET(request: NextRequest, { params }: { params: { data: string } }) {
  try {
    const searchParams = request.nextUrl.searchParams
    const force_download = searchParams.get('force_download')
    console.log('force_download', force_download)
    console.log('data', params.data)
    const decData = JSON.parse(fromHex(params.data as `0x${string}`, 'string')) as InvoicesView
    console.log('decData', decData)

    const browser = process.env.NODE_ENV === 'production' ?
      await puppeteer.connect({ browserWSEndpoint: process.env.BROWSERLESS_WS_URL })
      :
      await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })

    const page = await browser.newPage()
    const goto = process.env.NEXT_PUBLIC_BASE_URL + '/invoice/' + params.data
    await page.goto(goto)
    await page.emulateMediaType('screen')
    const pdfBuffer = await page.pdf({ format: 'A4' })
    await browser.close()
    const response = new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': ' application/pdf',
        'Content-Disposition': force_download ? 'attachment; filename="InvoiceHero.pdf"' : 'inline',
      },
    })
    return response
  } catch (error) {
    console.log(error)
    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }
}
