// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ReservesWallet is Ownable{

    IERC20 goldCoinToken;

    address public exchangeWallet;
    
    constructor(address _goldCoinToken, address _exchangeWalelt){
        goldCoinToken = IERC20(_goldCoinToken);
        exchangeWallet = _exchangeWalelt;
    }

    function supply() external {
        goldCoinToken.transfer(exchangeWallet, 10);
    }
    
}