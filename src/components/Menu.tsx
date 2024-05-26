import Link from "next/link";

export function Menu() {
  return (
    <nav className="w-full flex  border-b border-gray-200 py-3">
      <div className=" flex flex-row items-center ">
        <a href="/" className="flex">
          {/* logo */}
          <span
            className={` self-center text-sm md:text-2xl font-semibold whitespace-nowrap text-white`}
          >
            Invoice Hero
          </span>
        </a>
      </div>
      <div className="w-full flex justify-center mr-14">  <div className="flex justify-center gap-12 h-full w-fit bg-gray-600 rounded-3xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border p-5 border-[#9861c4] ">
        <Link className="block py-1 px-5 text-white  bg-[#9861c4] rounded-full focus:opacity-80" href="/">Home</Link>
        <Link className="block py-1 px-5 text-white bg-[#9861c4] rounded-full focus:opacity-80" href="/create">Create</Link>
        <Link className="block py-1 px-5 text-white bg-[#9861c4] rounded-full focus:opacity-80" href="/invoice/1">Invoice view</Link>
        <Link className="block py-1 px-5 text-white bg-[#9861c4] rounded-full focus:opacity-80" href="/invoice/1/download">PDF download</Link>
        <Link target='_blank' className="block py-1 px-5 text-white bg-[#9861c4] rounded-full focus:opacity-80" href="/api/pdf/1/">PDF view</Link></div></div>
    </nav>
  )
}