import { AuthView } from '@/lit';
import Image from 'next/image';

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
    <>
      <div >
        <div >
          <button
            type="button"
            title='Sign in with Google'
            onClick={handleGoogleLogin}
          >
            Sign in with Google
            <Image src="/google.png" width={24} height={24} alt="Google logo" />
          </button>
          <button
            type="button"
            title='Sign in with Discord'
            onClick={handleDiscordLogin}
          >
            Sign in with Discord
            <Image src="/discord.png" width={24} height={24} alt="Discord logo" />
          </button>

        </div>

        <button
          type="button"
          title='Sign in with wallet'
          onClick={() => setView('wallet')}
        >
          Sign in with wallet
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
      </div>
    </>
  );
};

export default AuthMethods;
