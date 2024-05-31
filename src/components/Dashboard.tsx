import { IRelayPKP, SessionSigs } from "@lit-protocol/types";
interface DashboardProps {
  currentAccount: IRelayPKP;
  sessionSigs: SessionSigs;
}

export default function Dashboard({
  currentAccount,
}: DashboardProps) {
  return (
    < >
      <div className="w-full max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Ready for the open web</h1>
        <p>Lit address: {currentAccount.ethAddress.toLowerCase()}</p>
      </div>
    </>
  );
}
