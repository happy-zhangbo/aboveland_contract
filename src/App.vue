<template>
  <NftAndProxyAccount></NftAndProxyAccount>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import NftAndProxyAccount from "@/components/NftAndProxyAccount.vue";
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    NftAndProxyAccount,
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
