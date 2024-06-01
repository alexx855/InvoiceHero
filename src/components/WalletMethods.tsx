"use client";
import { useConnect } from "wagmi";
import { useIsMounted } from "@/hooks/useIsMounted";
import Image from "next/image";
import { AuthView } from "@/lit";

interface WalletMethodsProps {
  authWithEthWallet: (connector: any) => Promise<void>;
  setView: React.Dispatch<AuthView>;
}

const WalletMethods = ({ authWithEthWallet, setView }: WalletMethodsProps) => {
  const isMounted = useIsMounted();
  const { connectors } = useConnect();

  if (!isMounted) return null;

  return (
    <div className="W-full flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Connect your web3 wallet</h1>
      <p className="mb-4">
        Connect your wallet then sign a message to verify you&apos;re the owner
        of the address.
      </p>
      <div className="max-w-fit mx-4 md:mx-0 px-8 py-10  text-gray-200 bg-white-600 rounded-3xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-50 border border-whitesmoke">
        {connectors.map((connector) => (
          <button
            type="button"
            className="w-full flex gap-2 mt-2 items-center justify-center px-8 py-3 text-base leading-6 font-medium rounded-md text-purple-700 dark:text-purple-700 bg-purple-100 hover:bg-purple-50 hover:text-purple-600 focus:ring ring-offset-2 ring-purple-100 focus:outline-none transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
            key={connector.id}
            onClick={() => authWithEthWallet({ connector })}
          >
            {connector.name.toLowerCase() === "metamask" && (
              <div className="mr-2">
                <Image
                  src="/metamask.png"
                  alt="MetaMask logo"
                  width={24}
                  height={24}
                ></Image>
              </div>
            )}
            {connector.name.toLowerCase() === "coinbase wallet" && (
              <div className="mr-2">
                <Image
                  src="/coinbase.png"
                  alt="Coinbase logo"
                  width={24}
                  height={24}
                ></Image>
              </div>
            )}
            <span>Continue with {connector.name}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setView("default")}
          className="relative inline-flex h-12 mt-4 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-10 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Back
          </span>
        </button>
      </div>
    </div>
  );
};

export default WalletMethods;
