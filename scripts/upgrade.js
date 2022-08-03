// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");
const proxyAddress = '0x827c3c4493F0424230164b2FEA6F088253750594'
async function main() {
  const [ owner ] = await ethers.getSigners();
  console.log(owner.address);
  const NFTContractV2 = await ethers.getContractFactory("AboveAssetsV2");
  const instance = await upgrades.upgradeProxy(proxyAddress, NFTContractV2);

  await instance.store(45);
  console.log(await instance.retrieve());

  console.log(instance.address," proxy address")
  console.log(await upgrades.erc1967.getImplementationAddress(instance.address)," getImplementationAddress")
  console.log(await upgrades.erc1967.getAdminAddress(instance.address), " getAdminAddress")


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
