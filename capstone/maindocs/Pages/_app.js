import React from 'react';
import WalletContextProvider from '../contexts/WalletContextProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <WalletContextProvider>
      <Component {...pageProps} />
    </WalletContextProvider>
  );
}

export default MyApp;
