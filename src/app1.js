import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const walletConnectConnector = new WalletConnectConnector({
  rpc: {
    1: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID', // Replace with your Infura Project ID
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 12000,
});

const App = () => {
  // Your existing code

  const { activate, deactivate, active, account } = useWeb3React();

  const handleConnectWallet = async () => {
    try {
      await activate(walletConnectConnector);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnectWallet = () => {
    deactivate();
  };

  // Your existing code

  return (
    <div className="App">
      {/* Your existing JSX code */}
      <div className="wallet-row">
        {!active ? (
          <button onClick={handleConnectWallet}>Connect Wallet</button>
        ) : (
          <>
            <p>Connected: {account}</p>
            <button onClick={handleDisconnectWallet}>Disconnect Wallet</button>
          </>
        )}
      </div>
      {/* Your existing JSX code */}
    </div>
  );
};

export default App;