import Background from '@/components/Background'
import { InvoiceList } from '@/components/InvoiceList'
import Landing from '@/components/Landing'
import { Menu } from '@/components/Menu'

function Page() {
  return (
    <>
      <Background />
      <div className="grid grid-rows-[auto,1fr] min-h-screen text-center">
        <Menu />
        <div className="flex items-center justify-center">
          <Landing/>
        </div>
      </div>
    </>
  )
}

export default Page
