import { InvoiceForm } from "@/components/InvoiceForm"
import { Menu } from "@/components/Menu"

export default function Page() {
  return (
    <>
      <Menu />
      <h1 className="mb-4 mt-0 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Create new Invoice</h1>
      <InvoiceForm />
    </>
  )
}