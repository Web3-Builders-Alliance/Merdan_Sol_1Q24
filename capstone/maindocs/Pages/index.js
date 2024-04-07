// pages/index.js

import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="home-content">
          <h1>MAINDOCS</h1>
          <p>Create fully customisable and verifiable documents from your wallet</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
