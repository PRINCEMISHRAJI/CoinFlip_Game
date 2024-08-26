import { ethers } from 'ethers';

let provider;

if (typeof window !== 'undefined' && window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
} else {
    console.log("Window in web3.js not found");
    
}

export default provider;
