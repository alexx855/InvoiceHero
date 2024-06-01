import Link from "next/link";
import Account from "@/components/Account";

export function Menu() {
  return (
    <nav className="w-full flex  border-b border-gray-200 p-3 z-100">
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
        <div className="flex items-center justify-center gap-12 h-full w-fit bg-gray-600 rounded-3xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50  p-5  ">
          <Link
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 "
            href="/"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-900 px-10 py-3 text-sm font-medium text-white backdrop-blur-3xl">
              Home
            </span>
          </Link>
          <Link
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 "
            href="/create"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-900 px-10 py-3 text-sm font-medium text-white backdrop-blur-3xl">
              Create
            </span>
          </Link>
          <Link
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 "
            href="/login"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-900 px-10 py-3 text-sm font-medium text-white backdrop-blur-3xl">
              Login
            </span>
          </Link>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end">
        <Account />
      </div>
    </nav>
  );
}
