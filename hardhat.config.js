require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config();

const PRIVATE_KEY=`0x${process.env.PRIVATE_KEY}`;
const INFURA_KEY=`${process.env.INFURA_KEY}`;
const ETHERSCAN_API_KEY = `${process.env.ETHERSCAN_API_KEY}`
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    dev: {
      url: "https://www.blackwarrior.vip/eth",
      accounts: [PRIVATE_KEY]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY]
    }
  },
  gasReporter: {
    enabled: false,
    currency: 'BAK',
    gasPrice: 8
  },
  etherscan: {
    apiKey: `${ETHERSCAN_API_KEY}`
  }
};
