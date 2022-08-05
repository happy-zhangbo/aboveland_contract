// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import "hardhat/console.sol";

contract AboveAssets is ERC1155, AccessControl, Ownable {
    using Strings for uint256;
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC1155("data:application/json;base64,") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(URI_SETTER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);

        // _setBaseURI("data:application/json;base64,");
    }

    string signPrefix = "\x19Ethereum Signed Message:\n32";
    
    string public name = "Above Assets";

    address private _signer;
    
    // Optional base URI
    string private _baseURI = "";

    mapping(uint256 => uint256) private _totalSupply;

    uint256 public _tokenId = 0;

    struct MetaData {
        uint256 level;
        string quality;
        string attrsUrl;
    }

    // Optional mapping for token URIs
    mapping(uint256 => MetaData) private _tokenURIs;

    mapping(address => uint256) public _nonce;

    function mintNft(address to, uint256 level, string memory quality, string memory  attrsUrl, bytes memory signature)external {
        bytes32 msgHash = keccak256(abi.encodePacked(signPrefix, keccak256(abi.encodePacked(to, level, quality, attrsUrl, _nonce[_msgSender()]))));
        require(_validSignature(signature, msgHash) == _signer, "Signature error");
        MetaData storage md = _tokenURIs[_tokenId];
        md.level = level;
        md.quality = quality;
        md.attrsUrl = attrsUrl;
        _mint(to, _tokenId, 1, "0");
        _tokenId = _tokenId + 1;
        _nonce[_msgSender()]++;
    }

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        MetaData memory md = _tokenURIs[tokenId];
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"tokenId": "Above Assets #', tokenId.toString(), '",',
                '"level": ', md.level.toString(), ',',
                '"quality": "', md.quality, '",',
                '"attrsUrs": "ipfs://', md.attrsUrl, '"'
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function updateURI(uint256 tokenId, uint256 level, string memory quality, string memory attrsUrl, bytes memory signature) external {
        require(_exists(tokenId), "Token does not exist");
        require(balanceOf(_msgSender(), tokenId) > 0, "The owner of the token is wrong");
        bytes32 msgHash = keccak256(abi.encodePacked(signPrefix, keccak256(abi.encodePacked(tokenId, level, quality, attrsUrl, _nonce[_msgSender()]))));
        require(_validSignature(signature, msgHash) == _signer, "Signature error");
        _tokenURIs[tokenId].level = level;
        _tokenURIs[tokenId].quality = quality;
        _tokenURIs[tokenId].attrsUrl = attrsUrl;
        _nonce[_msgSender()]++;
    }


    function _validSignature(bytes memory signature, bytes32 msgHash) private pure returns (address) {
        return ECDSA.recover(msgHash, signature);
    }
    
    function setKey(address signer) external onlyOwner {
        _signer = signer;
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

    function supportsInterface(bytes4 interfaceId)public view override(ERC1155, AccessControl)returns (bool){
        return super.supportsInterface(interfaceId);
    }
}

