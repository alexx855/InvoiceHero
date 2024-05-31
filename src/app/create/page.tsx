import Background from "@/components/Background"
import { InvoiceForm } from "@/components/InvoiceForm"
import { Menu } from "@/components/Menu"

export default function Page() {
  return (
    <>
      <Background />
      <div className="grid grid-rows-[auto,1fr] h-screen text-center">
        <Menu />
        <div className="flex items-center justify-center">
          <InvoiceForm />
        </div>
      </div>
    </>
  )
}