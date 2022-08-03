// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./AboveAssets.sol";

contract AboveAssetsV2 is AboveAssets {
    
    uint256 private value;
 
    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);
 
    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }
    
    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
    
    // Increments the stored value by 1
    function increment() public {
        value = value + 2;
        emit ValueChanged(value);
    }


    function mintNft(address to,string memory metadata, bytes memory signature)public virtual override{
        bytes32 msgHash = keccak256(abi.encodePacked(signPrefix, keccak256(abi.encodePacked(metadata, to))));
        require(_validSignature(signature, msgHash) == _signer, "Signature error");
        _mint(to, _tokenId, 2, "0");
        _setURI(_tokenId, metadata);
        _tokenId = _tokenId + 1;
    }
}

