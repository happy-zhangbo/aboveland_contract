// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const fs = require('fs');
const { ethers } = require("hardhat");
require('dotenv').config();

function copyFile(src, dist) {
    fs.writeFileSync(dist, fs.readFileSync(src));
}

  
async function main() {
//   const [ owner ] = await ethers.getSigners();
//   const NFTContract = await ethers.getContractFactory("AboveAssets");
//   const gameItems = await NFTContract.deploy();
//   await gameItems.setKey(owner.address);

  // 部署金币合约()
  const GoldCoinContract = await ethers.getContractFactory("GoldCoinToken");
  let goldCoin = await GoldCoinContract.deploy(10000, 10);
  copyFile('./artifacts/contracts/gold/GoldCoinToken.sol/GoldCoinToken.json', './src/abi/GoldCoinToken.json');
  // let content = `VUE_APP_GOLD_CONTRACT=${goldCoin.address}\n`;
  console.log(`Gold Coin Address: ${goldCoin.address}`);


  //部署交易所钱包
  const ExchangeWalletContract = await ethers.getContractFactory("ExchangeWallet");
  let exchangeWallet = await ExchangeWalletContract.deploy(goldCoin.address);
  copyFile('./artifacts/contracts/exchange/ExchangeWallet.sol/ExchangeWallet.json', './src/abi/ExchangeWallet.json');
  // content += `VUE_APP_EXCHANGE_CONTRACT=${exchangeWallet.address}\n`;
  console.log(`Exchange Wallet Address: ${exchangeWallet.address}`);

  //部署储备金钱包
  const ReservesWalletContract = await ethers.getContractFactory("ReservesWallet");
  let reservesWallet = await ReservesWalletContract.deploy(goldCoin.address, exchangeWallet.address);
  copyFile('./artifacts/contracts/exchange/ReservesWallet.sol/ReservesWallet.json', './src/abi/ReservesWallet.json');
  // content += `VUE_APP_RESERVES_CONTRACT=${reservesWallet.address}\n`;
  console.log(`Reserves Wallet Address: ${reservesWallet.address}`);

  // try {
  //   // fs.writeFileSync('.env.local', content)
  //   //文件写入成功。
  // } catch (err) {
  //   console.error(err)
  // }
  //Set Conifg
  await goldCoin.setExchangeWallet(exchangeWallet.address);
  await goldCoin.setReservesWallet(reservesWallet.address);

  //TODO Set Key
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
