import React, { useState } from 'react';
import { ethers } from 'ethers';
import provider from './lib/web3'; // Ensure this file exists and exports a valid provider
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // Ensure this file exists and contains the CSS rules
import WalletCard from './components/WalletCard'; // Import the new WalletCard component
import CoinFlip from './components/CoinFlip';
import contractAddress from '../contracts/contractAddress';
import contractABI from '../contracts/contractABI';

function App() {
    const [account, setAccount] = useState(null);
    const [amount, setAmount] = useState('');
    const [side, setSide] = useState(true);
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [flipResult, setFlipResult] = useState('');

    const connectWallet = async () => {
        try {
            const [selectedAccount] = await provider.send("eth_requestAccounts", []);
            setAccount(selectedAccount);
            toast.success('Wallet connected successfully!');
        } catch (error) {
            console.error("Failed to connect wallet", error);
            toast.error('Failed to connect wallet.');
        }
    };

    const flipCoin = async () => {
        if (!amount) {
            alert('Please enter an amount before flipping the coin.');
            return;
        }
    
        if (!account) return;
        if (!amount || !account) return;
    
        setLoading(true);
        try {
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const tx = await contract.flip(side, { value: ethers.utils.parseEther(amount) });
            await tx.wait();
    
            // Fetch the result from the event
            const filter = contract.filters.BetResult(account);
            const events = await contract.queryFilter(filter, tx.blockNumber, tx.blockNumber);
            const event = events.find(e => e.transactionHash === tx.hash);
    
            if (event) {
                const { win, side: resultSide } = event.args;
                const result = win ? (resultSide ? 'heads' : 'tails') : (resultSide ? 'tails' : 'heads');
                setFlipResult(result);
                console.log(`Result from contract: ${result}`);
            } else {
                console.warn("No BetResult event found for this transaction.");
            }
    
            setTxHash(tx.hash);
        } catch (error) {
            console.error("Failed to flip coin", error);
            toast.error('Transaction failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || !isNaN(value) && Number(value) >= 0) {
            setAmount(value);
        }
    };

    return (
        <>
            {account && <WalletCard account={account} />}
            <div className="container">
                <h1>Coin Flip Game</h1>
                {!account ? (
                    <button className="button" onClick={connectWallet}>Connect Wallet</button>
                ) : (
                    <div className="game">
                        <input
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="Amount (ETH)"
                            className="input"
                            min="0"
                        />
                        <div className="buttons">
                            <button className={`button ${side === true ? 'selected' : ''}`} onClick={() => setSide(true)}>Heads</button>
                            <button className={`button ${side === false ? 'selected' : ''}`} onClick={() => setSide(false)}>Tails</button>
                        </div>
                        <button className="button" onClick={flipCoin} disabled={loading}>
                            {loading ? 'Processing...' : 'Flip Coin'}
                        </button>
                        <CoinFlip result={flipResult} />
                        {txHash && (
                            <div className="transaction">
                                <p>Transaction Hash:</p>
                                <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                                    {txHash}
                                </a>
                            </div>
                        )}
                    </div>
                )}
                <ToastContainer />
            </div>
            {/* Instructions container */}
            <div className="instructions-container">
                <h2>How to Play</h2>
                <p>1. Connect your Ethereum wallet by clicking the 'Connect Wallet' button.</p>
                <p>2. Enter the amount of ETH you want to bet.</p>
                <p>3. Choose 'Heads' or 'Tails' to select your side.</p>
                <p>4. Click 'Flip Coin' to make your bet.</p>
                <p>5. If you win the bet amount will be doubled.</p>
                <p>6. If you lose , the bet amount will be lost.</p>
                <p>7. Your transaction hash will be displayed after the flip.</p>
            </div>
        </>
    );
}

export default App;
