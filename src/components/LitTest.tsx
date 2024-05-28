'use client'

import { useState } from 'react'
import { testDiscordAuthMethod } from './testDiscordAuthMethod'
import { testGoogleAuthMethod } from './testGoogleAuthMethod'
import { useLit } from '@/hooks/useLit'
import { testWithCustomBrowserSigner } from './testWithCustomBrowserSigner'

function LitTest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { litNodeClient, litAuthClient } = useLit();

  async function withLoadingAndErrorHandling(fn: () => Promise<any>) {
    if (loading) return;
    setLoading(true);
    try {
      console.log('Loading...');
      await fn();
      console.log('Success!');
    } catch (error: any) {
      console.error('An error occurred:', error);
      setError(error?.message || JSON.stringify(error));
    } finally {
      console.log('Loading finished.');
      setLoading(false);
    }
  }

  return (
    <>
      <div>
        {loading && <p>Loading..</p>}
        {error && <p>Error: {error}</p>}

        <div className="card">
          {litNodeClient && litAuthClient && (
            <>
              <button onClick={() => withLoadingAndErrorHandling(testWithCustomBrowserSigner)}>
                testWithCustomBrowserSigner
              </button>
              <hr />
              <button onClick={() => withLoadingAndErrorHandling(testDiscordAuthMethod)}>
                testDiscordAuthMethod
              </button>
              <hr />
              <button onClick={() => withLoadingAndErrorHandling(testGoogleAuthMethod)}>
                testGoogleAuthMethod
              </button>
            </>)}
        </div>
      </div>
    </>
  )
}

export default LitTest
