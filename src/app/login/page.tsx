import Account from "@/components/Account"
import LitTest from "@/components/LitTest"
import Login from "@/components/Login"
import { Menu } from "@/components/Menu"

export default function Page() {
  return (
    <>
      <Menu />
      <Account />
      {/* <LitTest /> */}
      <Login />
    </>
  )
}