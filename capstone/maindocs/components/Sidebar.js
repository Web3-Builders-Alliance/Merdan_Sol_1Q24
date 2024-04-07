import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        {/* Your Logo Here */}
        <img src="/maindocs_clear.jpeg" alt="Logo" />
      </div>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/tx-history">TX History</Link></li>
        <li><Link href="/subscription">Subscription</Link></li>
        <li><Link href="/verification">Verification</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
