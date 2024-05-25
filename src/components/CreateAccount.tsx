interface CreateAccountProp {
  signUp: any;
  error?: Error;
}

export default function CreateAccount({ signUp, error }: CreateAccountProp) {
  return (
    <div>
      <div>
        {error && (
          <div>
            <p>{error.message}</p>
          </div>
        )}
        <h1>Need a PKP?</h1>
        <p>
          There doesn&apos;t seem to be a Lit wallet associated with your
          credentials. Create one today.
        </p>
        <div>
          <button onClick={signUp}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
