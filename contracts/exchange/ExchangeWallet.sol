// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ExchangeWallet is Ownable{

    IERC20 goldCoinToken;
    
    constructor(address _goldCoinToken){
        goldCoinToken = IERC20(_goldCoinToken);
    }

    function exchange() external {
        goldCoinToken.transfer(msg.sender, 1);
    }
}