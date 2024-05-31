"use client"
import { useConnect } from 'wagmi';
import { useIsMounted } from '@/hooks/useIsMounted';
import Image from 'next/image';
import { AuthView } from '@/lit';

interface WalletMethodsProps {
  authWithEthWallet: (connector: any) => Promise<void>;
  setView: React.Dispatch<AuthView>;
}

const WalletMethods = ({ authWithEthWallet, setView }: WalletMethodsProps) => {
  const isMounted = useIsMounted();
  const { connectors } = useConnect();

  if (!isMounted) return null;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Connect your web3 wallet</h1>
      <p className="mb-4">
        Connect your wallet then sign a message to verify you&apos;re the owner
        of the address.
      </p>
      <div className="flex flex-col space-y-4">
        {connectors.map(connector => (
          <button
            type="button"
            className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded"
            key={connector.id}
            onClick={() => authWithEthWallet({ connector })}
          >
            {connector.name.toLowerCase() === 'metamask' && (
              <div className="mr-2">
                <Image
                  src="/metamask.png"
                  alt="MetaMask logo"
                  width={24}
                  height={24}
                ></Image>
              </div>
            )}
            {connector.name.toLowerCase() === 'coinbase wallet' && (
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
        <button onClick={() => setView('default')} className="text-blue-500">
          Back
        </button>
      </div>
    </>
  );
};

export default WalletMethods;