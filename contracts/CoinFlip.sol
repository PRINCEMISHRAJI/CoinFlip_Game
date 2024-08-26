// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CoinFlip {
    address public owner;

    event BetResult(address indexed player, bool win, uint256 amount, bool side);

    constructor() {
        owner = msg.sender;
    }

    // Function to receive Ether. This is called when no data is sent with the transaction.
    receive() external payable {}

    // Function to handle Ether sent with data
    fallback() external payable {}

    function flip(bool _guess) public payable {
        require(msg.value > 0, "Must send ETH to play");
        bool result = (block.timestamp % 2 == 0); // Simplified randomness
        bool win = (result == _guess);
        if (win) {
            payable(msg.sender).transfer(msg.value * 2);
        }
        emit BetResult(msg.sender, win, msg.value, _guess);
    }
}
