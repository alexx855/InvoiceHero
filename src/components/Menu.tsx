import Link from "next/link";
import Account from "@/components/Account";

export function Menu() {
  return (
    <nav className="w-full flex  border-b border-gray-200 p-3">
      <div className="flex flex-row items-center ">
        <a href="/" className="flex">
          {/* logo */}
          <span
            className={` self-center text-sm md:text-2xl font-semibold whitespace-nowrap text-white`}
          >
            Invoice Hero
          </span>
        </a>
      </div>
      <div className="w-full flex justify-center mr-14">
        <div className="flex items-center justify-center gap-12 h-full w-fit bg-gray-600 rounded-3xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border p-5 border-[#9861c4] ">
          <Link className="block py-2 px-5 text-white bg-[#9861c4] rounded-full focus:opacity-80" href="/">Home</Link>
          <Link className="block py-2 px-5 text-white bg-[#9861c4] rounded-full focus:opacity-80" href="/create">Create</Link>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end">
        <Account />
      </div>
    </nav>
  )
}