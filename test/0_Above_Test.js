// const {
//   time,
//   loadFixture,
// } = require("@nomicfoundation/hardhat-network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { encode, decode } = require('js-base64')
const crypto = require('crypto');
const Web3Utils = require('web3-utils');

describe("Base Test", function () {
  let gameItems;
  let tokenId;

  async function deployNftTokenFixture() {
    // const [ owner ] = await ethers.getSigners();
    const NFTContract = await ethers.getContractFactory("AboveAssets");
    const instance = await upgrades.deployProxy(NFTContract);

    console.log(instance.address," box/proxy")
    console.log(await upgrades.erc1967.getImplementationAddress(instance.address)," getImplementationAddress")
    console.log(await upgrades.erc1967.getAdminAddress(instance.address), " getAdminAddress")   

    gameItems = instance;


  }

  async function signMetadata(types, contents, owner){
    var msg = ethers.utils.keccak256(ethers.utils.solidityPack(types, contents));
    var msgHash = ethers.utils.arrayify(msg);
    var sign = await owner.signMessage(msgHash);
    return sign;
  }

  async function getMsgData(level){
    var metadata = {
      "name": "Dragon Slayer Sword",
      "image": "https://img.lianzhixiu.com/uploads/220719/1-220G915032N25.JPG",
      "attributes_uri": "ipfs://QmSsw6EcnwEiTT9c4rnAGeSENvsJMepNHmbrgi2S9bXNJr",
      "attributes": [{
          "trait_type": "Level",
          "value": level
      }, {
          "trait_type": "Quality",
          "value": "RED"
      }]
    }
    var str = JSON.stringify(metadata);
    var data = encode(str);
    return data;
  }

  describe("NFT", async function(){
    it("Deploy NFT1155 Contract", async function(){
      await loadFixture(deployNftTokenFixture);
    });

  
    it("Set Key", async function(){
      const [ owner ] = await ethers.getSigners();
      await gameItems.setKey(owner.address);
    });
  
    it("Mint NFT", async function(){
      const [ owner ] = await ethers.getSigners();
      var data = await getMsgData(4005);
      
      const sign = await signMetadata(["string", "address"], [data, owner.address], owner);
      
      const tx = await gameItems.mintNft(owner.address, data, sign);
      const receipt = await tx.wait()
      for (const event of receipt.events) {
        if(event.event == "TransferSingle"){
          tokenId = event.args.id;
        }
      }
      expect(await gameItems.balanceOf(owner.address,tokenId)).to.equal(1);
    });

    it("Update Token URI", async function(){
      const [ owner ] = await ethers.getSigners();
      var data = await getMsgData(4010);
      const sign = await signMetadata(["string", "uint256"], [data, tokenId], owner);
      await gameItems.updateURI(tokenId, data, sign);
      const uri = await gameItems.uri(tokenId);
      const chainMetadata = JSON.parse(decode(uri.split(",")[1]))
      expect(chainMetadata.attributes[0].value).to.equal(4010);
    });
  });

  let factory;
  let vaultAddress;
  let salt;
  let newTokenId;
  
  async function deployFactoryContractFixture() {
    // const [ owner ] = await ethers.getSigners();
    const FactoryContract = await ethers.getContractFactory("ProxyAccountFactory");
    factory = await FactoryContract.deploy();
  }

  describe("Proxy Accounts", async function(){
    async function getSalt(){
      //创建盐
      const md5 = crypto.createHash('md5');
      const result = md5.update("1568422").digest('hex');
      const hex = Web3Utils.utf8ToHex(result).substring(2);
      const salt = `0x${'0'.repeat(64-hex.length)}${hex}`
      return salt;
    }

    async function getAccount(salt){
      //获取账户Code和代理账户
      const byteCode = await factory.getBytecode();
      
      const vaultAddress = `0x${Web3Utils.sha3(`0x${[
          'ff',
          factory.address,
          salt,
          Web3Utils.sha3(byteCode)
      ].map(x => x.replace(/0x/, '')).join('')}`).slice(-40)}`.toLowerCase();
      // console.log(vaultAddress);
      return vaultAddress;
    }

    it("Deploy Proxy Account Factory Contract", async function(){
      await loadFixture(deployFactoryContractFixture);
    });

    it("Create Proxy Account", async function(){
      salt = await getSalt();
      vaultAddress = await getAccount(salt);
    });

    it("Mint Nft To Proxy Account", async function(){
      const [ owner ] = await ethers.getSigners();
      var data = await getMsgData(4005);
      
      const sign = await signMetadata(["string", "address"], [data, vaultAddress], owner);
      
      const tx = await gameItems.mintNft(vaultAddress, data, sign);
      const receipt = await tx.wait()
      for (const event of receipt.events) {
        if(event.event == "TransferSingle"){
          newTokenId = event.args.id;
        }
      }
      expect(await gameItems.balanceOf(vaultAddress,newTokenId)).to.equal(1);
    });


    it("Deploy Proxy Account Contract", async function(){
      const tx = await factory.createDeploySalted(salt)
      const receipt = await tx.wait()
      let proxyAccount;
      for (const event of receipt.events) {
        if(event.event == "DeployProxyAccount"){
          proxyAccount = event.args.account;
        }
      }
      expect(proxyAccount.toLowerCase).to.equal(vaultAddress.toLowerCase);
    });

    it("Withdraw Token", async function(){
      const [ owner ] = await ethers.getSigners();
      const AccountContract = await ethers.getContractFactory("Vault");
      const account = AccountContract.attach(vaultAddress);
      account.withdrawERC1155(gameItems.address, newTokenId, 1);
      expect(await gameItems.balanceOf(owner.address, newTokenId)).to.equal(1);
    });
  });


  describe("Upgrade Contract", async function(){
    it("Deploy Upgrade Contract", async function(){
      const [ owner ] = await ethers.getSigners();
      const AboveAssetsV2 = await ethers.getContractFactory("AboveAssetsV2");
      const instance = await upgrades.upgradeProxy(gameItems.address, AboveAssetsV2);
      
      console.log(instance.address," box/proxy")
      console.log(await upgrades.erc1967.getImplementationAddress(instance.address)," getImplementationAddress")
      console.log(await upgrades.erc1967.getAdminAddress(instance.address), " getAdminAddress")

      gameItems = instance;
      await gameItems.store(45);
      expect(await gameItems.retrieve()).to.equal(45);
    });


  });
});
