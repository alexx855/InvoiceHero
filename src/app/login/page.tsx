import Background from "@/components/Background"
import Login from "@/components/Login"
import { Menu } from "@/components/Menu"

export default function Page() {
  return (
    <>
      <Background />
      <div className="grid grid-rows-[auto,1fr] h-screen text-center">
        <Menu />
        <div className="flex items-center justify-center">
          <Login />
        </div>
      </div>
    </>
  )
}