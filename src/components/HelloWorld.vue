<template>
  <div class="hello">
    <el-container>
      <el-main style="line-height: 40px;">
        <h1>连接账户</h1>
        <el-button @click="connect">Connect Wallet</el-button><br />
        Connect Wallet Address：{{ signer }}<br />
        <h1>NFT代理账户</h1>
        <el-button @click="login">Login and Get Proxy Account</el-button>
        <el-button>Bind Master Account</el-button>
        <el-button>Mint NFT</el-button>
        <el-button>Update NFT Metadata</el-button>
        <el-button>Deploy Proxy Account</el-button>
        <el-button>Receive NFT to Master Account</el-button>
        <el-button>Get Token URI</el-button>
        <br />
        Proxy Account:
        Master Account:
        NFT Balance:


        <h1>ERC20 Token兑换</h1>
        <el-button @click="everydaymint">Every Day Mint</el-button>
        <el-button @click="exchange">Exchange</el-button>
        <el-button @click="supply">Supply</el-button>
        <br />
        Gold Balance:  {{ balance.signer }}
        <br /><br />
        GOLD CONTRACT Address：{{ address.gold }}<br /><br />
        EXCHANGE Wallet Address：{{ address.exchange }}<br />
        EXCHANGE Wallet Gold Balance:  {{ balance.exchange }}<br />
        RESERVES Wallet Address：{{  address.reserves }}<br />
        RESERVES Wallet Gold Balance:  {{ balance.reserves }}<br />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import goldAbi from "@/abi/GoldCoinToken.json";
import exchangeAbi from "@/abi/ExchangeWallet.json";
import reservesAbi from "@/abi/ReservesWallet.json";

import { ethers } from 'ethers';
const provider = new ethers.providers.Web3Provider(window.ethereum);
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      goldContract: null,
      exchangeContract: null,
      reservesContract: null,
      signer: null,
      address: {
        gold: process.env.VUE_APP_GOLD_CONTRACT,
        exchange: process.env.VUE_APP_EXCHANGE_CONTRACT,
        reserves: process.env.VUE_APP_RESERVES_CONTRACT
      },
      balance: {
        signer: 0,
        exchange: 0,
        reserves: 0
      }
    }
  },
  async created(){

    
  },
  methods: {
    async connect(){
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      this.provider = provider;
      this.signer = signer.provider.provider.selectedAddress;
      const goldContract = new ethers.Contract(process.env.VUE_APP_GOLD_CONTRACT, goldAbi.abi, provider);
      this.goldContract = goldContract.connect(signer);

      const exchangeContract = new ethers.Contract(process.env.VUE_APP_EXCHANGE_CONTRACT, exchangeAbi.abi, provider);
      this.exchangeContract = exchangeContract.connect(signer);

      const reservesContract = new ethers.Contract(process.env.VUE_APP_RESERVES_CONTRACT, reservesAbi.abi, provider);
      this.reservesContract = reservesContract.connect(signer);

      this.getBalance();
    },
    async login(){

    },
    async everydaymint() {
      await this.goldContract.mintEveryday();
      await this.getBalance();
    },
    async exchange() {
      await this.exchangeContract.exchange();
      await this.getBalance();
    },
    async supply() {
      await this.reservesContract.supply();
      await this.getBalance();
    },
    async getBalance(){
      //获取余额
      let exchangeBalance = await this.goldContract.balanceOf(process.env.VUE_APP_EXCHANGE_CONTRACT)
      this.balance.exchange = exchangeBalance

      let reservesBalance = await this.goldContract.balanceOf(process.env.VUE_APP_RESERVES_CONTRACT)
      this.balance.reserves = reservesBalance

      let signerBalance = await this.goldContract.balanceOf(this.signer)
      this.balance.signer = signerBalance
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
