import Account from '@/components/Account'
import { InvoiceList } from '@/components/InvoiceList'
import { Menu } from '@/components/Menu'

function Page() {
  return (
    <>
      <Menu />
      <Account />
      <h1 className="mb-4 mt-0 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Invoice Hero</h1>
      <InvoiceList />
    </>
  )
}

export default Page
