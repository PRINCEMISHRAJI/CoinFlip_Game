// src/WalletCard.js

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import provider from '../lib/web3'; // Ensure this file exports a valid provider

const WalletCard = ({ account }) => {
    const [balance, setBalance] = useState('0');
  
    useEffect(() => {
      const fetchBalance = async () => {
        try {
          const balance = await provider.getBalance(account);
          setBalance(ethers.utils.formatEther(balance));
        } catch (error) {
          console.error("Failed to fetch balance", error);
        }
      };
  
      fetchBalance();
  
      // Set up polling every 30 seconds
      const intervalId = setInterval(fetchBalance, 30000);
  
      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [account]);
  

    return (
        account && (
            <div className="wallet-card">
                <h2>Connected Wallet</h2>
                <p><strong>Address:</strong> {account}</p>
                <p><strong>Balance:</strong> {balance} ETH</p>
            </div>
        )
    );
}

export default WalletCard;
