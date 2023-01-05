// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract GoldCoinToken is ERC20, Ownable {

    uint256 public amountFixed;

    uint256 public reservesRatio;

    address private _signer;

    address public reservesWallet;

    address public exchangeWallet;
    
    constructor(uint256 _amountFixed,uint256 _reservesRatio) ERC20("Gold-Coin", "GLDC") {
        amountFixed = _amountFixed;
        reservesRatio = _reservesRatio;
    }

    function getAmount(uint256 total, uint256 prop)public pure returns(uint256){
        return (total * prop) / 100;
    }

    function mintEveryday()external onlyOwner{
        require(address(0) != reservesWallet 
            && address(0) != exchangeWallet, "not set Reserves Wallet and Exchange Wallet!");
        
        require(0 != amountFixed, "not set everyday fixed amount");

        _mint(reservesWallet,getAmount(amountFixed, reservesRatio));
        _mint(exchangeWallet,getAmount(amountFixed, 100 - reservesRatio));
    }

    function setAmountFixed(uint256 _amountFixed) external onlyOwner {
        amountFixed = _amountFixed;
    }

    function setReservesRatio(uint256 _reservesRatio) external onlyOwner {
        reservesRatio = _reservesRatio;
    }

    function setKey(address signer) external onlyOwner {
        _signer = signer;
    }

    function setReservesWallet(address wallet) external onlyOwner {
        reservesWallet = wallet;
    }

    function setExchangeWallet(address wallet) external onlyOwner {
        exchangeWallet = wallet;
    }
}