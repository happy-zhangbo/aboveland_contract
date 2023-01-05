const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("Base", function () {

    let goldCoin;
    let exchangeWallet;
    let reservesWallet;
    async function deployGoldCoinTokenFixture() {
        // const [ owner ] = await ethers.getSigners();
        // 部署金币合约()
        const GoldCoinContract = await ethers.getContractFactory("GoldCoinToken");
        goldCoin = await GoldCoinContract.deploy(10000, 10);
        console.log(`Gold Coin Address: ${goldCoin.address}`);

        //部署交易所钱包
        const ExchangeWalletContract = await ethers.getContractFactory("ExchangeWallet");
        exchangeWallet = await ExchangeWalletContract.deploy(goldCoin.address);
        console.log(`Exchange Wallet Address: ${exchangeWallet.address}`);

        //部署储备金钱包
        const ReservesWalletContract = await ethers.getContractFactory("ReservesWallet");
        reservesWallet = await ReservesWalletContract.deploy(goldCoin.address, exchangeWallet.address);
        console.log(`Reserves Wallet Address: ${reservesWallet.address}`);
    }

    describe("Gold Coin Init", async function(){
        it("Deploy Contract", async function(){
            await loadFixture(deployGoldCoinTokenFixture);
        });

        it("Setting Config", async function(){
            await goldCoin.setExchangeWallet(exchangeWallet.address);
            expect(await goldCoin.exchangeWallet()).to.equal(exchangeWallet.address);

            await goldCoin.setReservesWallet(reservesWallet.address);
            expect(await goldCoin.reservesWallet()).to.equal(reservesWallet.address);
        });

        it("Everyday Mint Gold Coin", async function(){
            await goldCoin.mintEveryday();
            expect(await goldCoin.balanceOf(exchangeWallet.address)).to.equal((10000*90)/100);
            expect(await goldCoin.balanceOf(reservesWallet.address)).to.equal((10000*10)/100);
        });

        it("Exchange Gold Coin", async function(){
            const [ owner ] = await ethers.getSigners();
            await exchangeWallet.exchange();
            expect(await goldCoin.balanceOf(owner.address)).to.equal(1);
        });


        it("Reserves Supply Gold Coin to Exchange", async function(){
            const [ owner ] = await ethers.getSigners();
            await reservesWallet.supply();
            expect(await goldCoin.balanceOf(exchangeWallet.address)).to.equal(((10000*90)/100)+9);
            expect(await goldCoin.balanceOf(reservesWallet.address)).to.equal(((10000*10)/100)-10);
        });
    })
});
