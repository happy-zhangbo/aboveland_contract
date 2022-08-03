// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

contract AboveAssets is ERC1155Upgradeable, AccessControlUpgradeable, OwnableUpgradeable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    string signPrefix;
    
    string public name;

    address private _signer;
    
    // Optional base URI
    string private _baseURI;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    mapping(uint256 => uint256) private _totalSupply;

    uint256 public _tokenId;

    function initialize() public initializer {
        __ERC1155_init("data:application/json;base64,");
        __Ownable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(URI_SETTER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);

        _setBaseURI("data:application/json;base64,");

        signPrefix = "\x19Ethereum Signed Message:\n32";
        name = "Above Assets";
        _tokenId = 0;
    }

    function mintNft(address to,string memory metadata, bytes memory signature)public {
        bytes32 msgHash = keccak256(abi.encodePacked(signPrefix, keccak256(abi.encodePacked(metadata, to))));
        require(_validSignature(signature, msgHash) == _signer, "Signature error");
        _mint(to, _tokenId, 1, "0");
        _setURI(_tokenId, metadata);
        _tokenId = _tokenId + 1;
    }

    function uri(uint256 id) public view virtual override returns (string memory) {
        string memory tokenURI = _tokenURIs[id];
        // If token URI is set, concatenate base URI and tokenURI (via abi.encodePacked).
        return bytes(tokenURI).length > 0 ? string(abi.encodePacked(_baseURI, tokenURI)) : super.uri(id);
    }

    function updateURI(uint256 tokenId, string memory metadata, bytes memory signature) external {
        require(_exists(tokenId), "Token does not exist");
        require(balanceOf(_msgSender(), tokenId) > 0, "The owner of the token is wrong");
        bytes32 msgHash = keccak256(abi.encodePacked(signPrefix, keccak256(abi.encodePacked(metadata,tokenId))));
        require(_validSignature(signature, msgHash) == _signer, "Signature error");
        _setURI(tokenId, metadata);
    }

    function _validSignature(bytes memory signature, bytes32 msgHash) private pure returns (address) {
        return ECDSAUpgradeable.recover(msgHash, signature);
    }
    
    function setKey(address signer) external onlyOwner {
        _signer = signer;
    }

    /**
     * @dev Sets `tokenURI` as the tokenURI of `tokenId`.
     */
    function _setURI(uint256 id, string memory tokenURI) internal virtual {
        _tokenURIs[id] = tokenURI;
        emit URI(uri(id), id);
    }

    /**
     * @dev Sets `baseURI` as the `_baseURI` for all tokens
     */
    function _setBaseURI(string memory baseURI) internal virtual {
        _baseURI = baseURI;
    }

     /**
     * @dev Total amount of tokens in with a given id.
     */
    function totalSupply(uint256 id) public view virtual returns (uint256) {
        return _totalSupply[id];
    }

    /**
     * @dev Indicates whether any token exist with a given id, or not.
     */
    function _exists(uint256 id) public view virtual returns (bool) {
        return totalSupply(id) > 0;
    }

    /**
     * @dev See {ERC1155-_beforeTokenTransfer}.
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        if (from == address(0)) {
            for (uint256 i = 0; i < ids.length; ++i) {
                _totalSupply[ids[i]] += amounts[i];
            }
        }

        if (to == address(0)) {
            for (uint256 i = 0; i < ids.length; ++i) {
                uint256 id = ids[i];
                uint256 amount = amounts[i];
                uint256 supply = _totalSupply[id];
                require(supply >= amount, "ERC1155: burn amount exceeds totalSupply");
                unchecked {
                    _totalSupply[id] = supply - amount;
                }
            }
        }
    }

    function supportsInterface(bytes4 interfaceId)public view override(ERC1155Upgradeable, AccessControlUpgradeable)returns (bool){
        return super.supportsInterface(interfaceId);
    }
}

