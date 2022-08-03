// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");

async function main() {
  const [ owner ] = await ethers.getSigners();
  console.log(owner.address);
  const NFTContract = await ethers.getContractFactory("AboveAssets");
  const instance = await upgrades.deployProxy(NFTContract);
  await instance.deployed();
  console.log(instance.address," proxy address")
  console.log(await upgrades.erc1967.getImplementationAddress(instance.address)," getImplementationAddress")
  console.log(await upgrades.erc1967.getAdminAddress(instance.address), " getAdminAddress")


  await instance.setKey(owner.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
