import Account from "@/components/Account"
import { InvoiceForm } from "@/components/InvoiceForm"
import { Menu } from "@/components/Menu"
import background from '@/app/assets/bg1.jpg'

export default function Page() {
  return (
    <div
      style={{
        zIndex: -2,
        backgroundImage: `url(${background.src})`,
        backgroundColor: 'black',
        backgroundSize: 'cover',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Menu />
      <h1 className="w-full text-center py-10 text-4xl font-bold tracking-normal leading-5 text-white ">Create new Invoice</h1>
      <InvoiceForm />
    </div>
  )
}