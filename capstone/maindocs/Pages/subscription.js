// pages/subscription.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Subscription = () => {
  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Navbar />
        <h1>Subscription</h1>
      </div>
    </div>
  );
};

export default Subscription;
