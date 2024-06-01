import { AuthView } from "@/lit";
import Image from "next/image";

interface AuthMethodsProps {
  handleGoogleLogin: () => Promise<void>;
  handleDiscordLogin: () => Promise<void>;
  setView: React.Dispatch<AuthView>;
}

const AuthMethods = ({
  handleGoogleLogin,
  handleDiscordLogin,
  setView,
}: AuthMethodsProps) => {
  return (
    <ul className="flex w-full flex justify-center gap-8 ">
      <li>
        <button
          disabled
          className="w-full flex gap-2 opacity-50 items-center justify-center px-8 py-3 text-base leading-6 font-medium rounded-md text-purple-700 dark:text-purple-700 bg-purple-100 hover:bg-purple-50 hover:text-purple-600 focus:ring ring-offset-2 ring-purple-100 focus:outline-none transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
          type="button"
          title="Sign in with Google"
          onClick={handleGoogleLogin}
        >
          Sign in with Google
          <Image src="/google.png" width={24} height={24} alt="Google logo" />
        </button>
      </li>
      <li>
        <button
          disabled
          className="w-full flex gap-2 opacity-50 items-center justify-center px-8 py-3 text-base leading-6 font-medium rounded-md text-purple-700 dark:text-purple-700 bg-purple-100 hover:bg-purple-50 hover:text-purple-600 focus:ring ring-offset-2 ring-purple-100 focus:outline-none transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
          type="button"
          title="Sign in with Discord"
          onClick={handleDiscordLogin}
        >
          Sign in with Discord
          <Image src="/discord.png" width={24} height={24} alt="Discord logo" />
        </button>
      </li>
      <li>
        <button
          className="w-full flex gap-2 items-center justify-center px-8 py-3 text-base leading-6 font-medium rounded-md text-purple-700 dark:text-purple-700 bg-purple-100 hover:bg-purple-50 hover:text-purple-600 focus:ring ring-offset-2 ring-purple-100 focus:outline-none transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
          type="button"
          title="Sign in with wallet"
          onClick={() => setView("wallet")}
        >
          Sign in with Wallet
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
            />
          </svg>
        </button>
      </li>
    </ul>
  );
};

export default AuthMethods;
