// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Vault.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract ProxyAccountFactory {

    // address private nftToken;

    // constructor(address _nftToken){
    //     nftToken = _nftToken;
    // }

    event DeployProxyAccount(address from, bytes32 salt, address account);

    function createDeploySalted(bytes32 salt) external{
        Vault vault = new Vault{salt: salt}();
        vault.transferOwnership(msg.sender);
        emit DeployProxyAccount(msg.sender, salt, address(vault));
    }

    // get the ByteCode of the contract DeployWithCreate2
    function getBytecode() public pure returns (bytes memory) {
        bytes memory bytecode = type(Vault).creationCode;
        return abi.encodePacked(bytecode);
    }
}