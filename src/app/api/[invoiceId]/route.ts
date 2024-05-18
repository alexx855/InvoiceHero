import { Invoice } from "@/invoice"
import { INVOICE_MOCK } from "@/constants"

export interface ApiInvoiceResponse {
  data: Invoice
}

export async function POST(request: Request, { params }: { params: { invoiceId: string } }) {
  const data: Invoice = {
    id: params.invoiceId,
    ...INVOICE_MOCK
  }

  const res: ApiInvoiceResponse = { data }
  return Response.json(res)

}