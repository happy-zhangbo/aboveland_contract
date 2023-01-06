require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const PRIVATE_KEY=`0x${process.env.PRIVATE_KEY}`;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    dev: {
      url: "https://www.blackwarrior.vip/eth",
      accounts: [PRIVATE_KEY]
    },
    goerli: {
      url: "https://goerli.infura.io/v3/a2122abfa9b544dca3df8d951f84029b",
      accounts: [PRIVATE_KEY]
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'BAK',
    gasPrice: 1
  }
};
