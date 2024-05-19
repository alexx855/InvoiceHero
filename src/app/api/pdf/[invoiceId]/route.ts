import { NextRequest, NextResponse } from "next/server"
import puppeteer from 'puppeteer'

export async function GET(request: NextRequest) {
  try {
    const force_download = request.url.includes('?force_download')
    const parts = request.url.split('/');
    const invoiceId = parts[parts.length - 1];

    const browser = process.env.NODE_ENV === 'production' ?
      await puppeteer.connect({ browserWSEndpoint: process.env.BROWSERLESS_WS_URL })
      :
      await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] }) 

    const page = await browser.newPage()
    const goto = process.env.NEXT_PUBLIC_BASE_URL + '/invoice/' + invoiceId
    await page.goto(goto)
    await page.emulateMediaType('screen')
    const pdfBuffer = await page.pdf({ format: 'A4' })
    await browser.close()
    const response = new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': ' application/pdf',
        'Content-Disposition': force_download ? 'attachment; filename="invoice_test.pdf"' : 'inline',
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
