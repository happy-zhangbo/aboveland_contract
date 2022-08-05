// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract Vault is Ownable, ERC721Holder, ERC1155Holder {
  // using EnumerableSet for EnumerableSet.UintSet;
  string public version = "2.0";

  /// ------------------------
  /// -------- EVENTS --------
  /// ------------------------
  // event WithdrawERC20(address indexed token, address indexed to);
  // event WithdrawERC721(
  //   address indexed token,
  //   uint256 tokenId,
  //   address indexed to
  // );
  // event WithdrawERC1155(
  //   address indexed token,
  //   uint256 tokenId,
  //   uint256 amount,
  //   address indexed to
  // );
  // event WithdrawBatchERC1155(
  //   address indexed token,
  //   uint256[] tokenIds,
  //   uint256[] amounts,
  //   address indexed to
  // );

  function withdrawERC721(address _token, uint256 _tokenId) external onlyOwner{
    IERC721(_token).transferFrom(address(this), msg.sender, _tokenId);
    // emit WithdrawERC721(_token, _tokenId, msg.sender);
  }

  function withdrawERC1155(
    address _token,
    uint256 _tokenId,
    uint256 _amount
  ) external onlyOwner{
    IERC1155(_token).safeTransferFrom(
      address(this),
      msg.sender,
      _tokenId,
      _amount,
      "0"
    );
    // emit WithdrawERC1155(_token, _tokenId, _amount, msg.sender);
  }

  function withdrawBatchERC1155(
    address _token,
    uint256[] memory _tokenIds,
    uint256[] memory _amounts
  ) external onlyOwner {
    IERC1155(_token).safeBatchTransferFrom(
      address(this),
      msg.sender,
      _tokenIds,
      _amounts,
      "0"
    );
    // emit WithdrawBatchERC1155(_token, _tokenIds, _amounts, msg.sender);
  }

  function withdrawERC20(address _token) external onlyOwner{
    IERC20(_token).transfer(
      msg.sender,
      IERC20(_token).balanceOf(address(this))
    );
    // emit WithdrawERC20(_token, msg.sender);
  }
  // receive() external payable {}
}