import Background from '@/components/Background'
import { InvoiceList } from '@/components/InvoiceList'
import { Menu } from '@/components/Menu'

function Page() {
  return (
    <>
      <Background />
      <div className="grid grid-rows-[auto,1fr] h-screen text-center">
        <Menu />
        <div className="flex items-center justify-center">
          <InvoiceList />
        </div>
      </div>
    </>
  )
}

export default Page
