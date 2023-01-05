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
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'BAK',
    gasPrice: 1
  }
};
