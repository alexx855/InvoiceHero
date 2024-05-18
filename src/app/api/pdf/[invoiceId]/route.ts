import { NextResponse } from "next/server"
import puppeteer from 'puppeteer'

export async function GET(request: Request) {
  try {
    const force_download = request.url.includes('?force_download')
    const browser = await puppeteer.launch({ ignoreDefaultArgs: ['--disable-extensions'] })
    const page = await browser.newPage()
    const goto = request.url.replace('/api/pdf/', '/invoice/')
    console.log('request.url', request.url)
    console.log('goto', goto)
    await page.goto(goto)
    await page.emulateMediaType('screen')
    const pdfBuffer = await page.pdf({ format: 'A4' })
    await browser.close()
    // return image as response
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
