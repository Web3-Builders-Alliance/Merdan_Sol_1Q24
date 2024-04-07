// components/Navbar.js

import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="action-button">
        <WalletMultiButton />
      </div>
    </div>
  );
};

export default Navbar;
