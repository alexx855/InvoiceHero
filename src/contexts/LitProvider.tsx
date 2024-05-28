import { createContext, useEffect, useRef, useState } from 'react';

import { LitAuthClient } from '@lit-protocol/lit-auth-client';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitNodeClientConfig } from '@lit-protocol/types';

export type LitContextType = {
    litNodeClient: LitNodeClient | null;
    litAuthClient: LitAuthClient | null;
};

export const LitContext = createContext<LitContextType>({
    litNodeClient: null,
    litAuthClient: null,
});

export function LitProvider({ clientConfig, children }: { clientConfig: LitNodeClientConfig, children: React.ReactNode }) {
    const [litNodeClient, setLitNodeClient] = useState<LitNodeClient | null>(null);
    const [litAuthClient, setLitAuthClient] = useState<LitAuthClient | null>(null);

    const cleanupCalled = useRef(false);

    useEffect(() => {
        const client = new LitNodeClient(clientConfig);
        const authClient = new LitAuthClient({
            litRelayConfig: {
                relayApiKey: process.env.NEXT_PUBLIC_RELAY_API_KEY,
            },
            litNodeClient: client
        });

        console.log('connecting to lit node');
        client.connect().then(() => {
            // if (!cleanupCalled.current) {
            console.log('connected to lit node');
            setLitNodeClient(client);
            setLitAuthClient(authClient);
            // }

        }).catch((err) => {
            console.error('error connecting to lit node', err);
        });

        return () => {
            cleanupCalled.current = true;
            console.log('disconnecting from lit node');
            client.disconnect();
        }
    }, [clientConfig]);

    return (
        <LitContext.Provider value={{ litNodeClient, litAuthClient }}>
            {children}
        </LitContext.Provider>
    );
}