// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const fs = require('fs');
const { ethers } = require("hardhat");

async function main() {
  const [ owner ] = await ethers.getSigners();
  const NFTContract = await ethers.getContractFactory("AboveAssets");
  const gameItems = await NFTContract.deploy();
  await gameItems.setKey(owner.address);
  console.log(`NFTs : ${gameItems.address}`);

  const FactoryContract = await ethers.getContractFactory("ProxyAccountFactory");
  const factory = await FactoryContract.deploy();
  console.log(`Proxy Factory: ${factory.address}`);

  try {
    const bytecode = await factory.getBytecode();
    fs.writeFileSync('bytecode.txt', bytecode);
    //文件写入成功。
  } catch (err) {
    console.error(err)
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
