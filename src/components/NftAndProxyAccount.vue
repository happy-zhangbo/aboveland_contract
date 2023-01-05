<template>
  <div>
    <h1>Proxy Account</h1>
    <el-button @click="login">Login</el-button>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: "NftAndProxyAccount",
  data(){
    return {

    }
  },
  methods: {
    async login(){
      ElMessageBox.prompt('Please input your UserID', 'UserID', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
      }).then(({ value }) => {
        const salt = numberToUint256(value);
        const proxyAccount = buildCreate2Address(salt);
        ElMessage({
          type: 'success',
          message: `Your UserId is:${proxyAccount}`,
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: 'Input canceled',
        })
      })
    }
  }
}
</script>

<style scoped>

</style>