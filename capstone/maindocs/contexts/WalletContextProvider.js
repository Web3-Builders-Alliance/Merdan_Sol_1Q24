import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import * as web3 from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContextProvider = ({ children }) => {
    const endpoint = web3.clusterApiUrl('devnet');
    const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];
    const [connected, setConnected] = useState(false);

    const handleConnect = async () => {
        try {
            if (!connected) {
                await window.solana.connect();
                setConnected(true);
            }
        } catch (error) {
            console.error('Failed to connect:', error);
        }
    };

    const handleDisconnect = async () => {
        try {
            if (connected) {
                await window.solana.disconnect();
                setConnected(false);
            }
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    };

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    <div className="flex justify-end">
                        {connected ? (
                            <button onClick={handleDisconnect}>Disconnect</button>
                        ) : (
                            <WalletMultiButton onClick={handleConnect} />
                        )}
                    </div>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletContextProvider;
