import { formatAmount, type InvoicesView } from '@/invoice'
import { InvoiceStatusLabel } from './InvoiceStatusLabel'

export function InvoiceTable({ invoice }: { invoice: InvoicesView }) {
  return (
    <>
      <table style={{ width: '100%', tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top', width: '50%' }}>
              <div>
              </div>
              {/* <span><b>user.display_name || address</b></span><br /> */}
              <span>
                <span style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {/* user.additional_info */}
                </span>
              </span>
            </td>
            <td style={{ width: '50%', textAlign: 'right' }} >
              <span>Invoice</span><br />
              <span style={{ fontSize: '10pt' }}><strong># INV-{invoice.invoice_number}</strong></span> <br />
              <InvoiceStatusLabel status={invoice.status} />
            </td>
          </tr>

          <tr style={{ background: 'var(--background-body)' }}>
            <td style={{ width: '60%', verticalAlign: 'bottom', wordWrap: 'break-word' }}>
              <div><label style={{ fontSize: '10pt' }} >Bill To</label>
                <br />
                <span style={{ whiteSpace: 'pre-wrap' }}><strong><span>{invoice.client_display_name}</span></strong></span>
              </div>
            </td>
            <td align="right" style={{ verticalAlign: 'bottom', width: '40%' }}>
              <table style={{ float: 'right', width: '100%', tableLayout: 'fixed', wordWrap: 'break-word' }} cellSpacing={0} cellPadding={0}>
                <tbody>
                  <tr>
                    <td style={{ fontSize: '10pt', textAlign: 'right' }} >
                      <span>Invoice Date</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span>{new Date(invoice.creation_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </td>
                  </tr>

                  {invoice.due_date && (
                    <tr>
                      <td style={{ padding: '5px 10px 5px 0px', fontSize: '10pt', textAlign: 'right' }} >
                        <span>Terms :</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span>Due on {new Date(invoice.due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <table id="items" style={{ width: '100%', marginTop: '20px', tableLayout: 'fixed' }} cellSpacing={0} cellPadding={0}>
        <thead style={{ background: 'var(--background)' }}>
          <tr style={{ height: '32px' }}>
            <td style={{ padding: '5px 10px 5px 5px', width: '5%', textAlign: 'center' }}>
              #
            </td>
            <td style={{ padding: '5px 10px 5px 5px', textAlign: 'left' }}>
              Item &amp; Description
            </td>
            <td style={{ padding: '5px 10px 5px 5px', width: '10%', textAlign: 'right' }}>
              Qty
            </td>
            <td style={{ padding: '5px 10px 5px 5px', width: '10%', textAlign: 'right' }}>
              Rate
            </td>
            <td style={{ padding: '5px 10px 5px 5px', width: '15%', textAlign: 'right' }}>
              Amount
            </td>
          </tr>
        </thead>
        <tbody>
          {invoice.items.length > 0 && invoice.items.map((item, index) => (
            <tr key={`item-${index}`}>
              <td rowSpan={1} valign="top" style={{ textAlign: 'center', wordWrap: 'break-word' }}>
                {index + 1}
              </td>
              <td rowSpan={1} valign="top" style={{}}>
                <div>
                  <span style={{ wordWrap: 'break-word' }} >{item.details}</span><br />
                  <span style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} ></span>
                </div>
              </td>
              <td rowSpan={1} style={{ textAlign: 'right' }}>
                <span>{item.quantity}</span>
              </td>
              <td rowSpan={1} style={{ textAlign: 'right' }}>
                <span>{item.rate}</span>
              </td>
              <td rowSpan={1} style={{ textAlign: 'right' }}>
                <span>{formatAmount(item.amount, invoice.total_unit)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table id="totals" style={{ clear: 'both', width: '100%', marginTop: '30px', tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            <td style={{ width: '60%' }}> </td>
            <td align="right" style={{ verticalAlign: 'bottom', width: '40%' }}>
              <table style={{ float: 'right', width: '100%', tableLayout: 'fixed', wordWrap: 'break-word' }} cellSpacing={0} cellPadding={0}>
                <tbody>
                  <tr style={{ background: 'var(--background)' }}>
                    <td style={{ fontSize: '10pt', textAlign: 'right' }} >
                      <strong>Total</strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <strong>{formatAmount(invoice.total, invoice.total_unit)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ clear: 'both', marginTop: '50px', width: '100%' }}>
        <label style={{ fontSize: '10pt' }}>Notes</label><br />
        <p style={{ marginTop: '7px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{
          invoice.customer_notes
        }</p>
      </div>
    </>
  )
}

