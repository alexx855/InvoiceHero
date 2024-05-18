import Link from "next/link";

export function Menu() {
  return (
    <nav className="flex justify-around bg-blue-500 p-4">
      <Link className="text-white hover:text-blue-200" href="/">Home</Link>
      <Link className="text-white hover:text-blue-200" href="/create">Create</Link>
      <Link className="text-white hover:text-blue-200" href="/invoice/1">Invoice view</Link>
      <Link className="text-white hover:text-blue-200" href="/invoice/1/download">PDF download</Link>
      <Link target='_blank' className="text-white hover:text-blue-200" href="/api/pdf/1/">PDF view</Link>
    </nav>
  )
}