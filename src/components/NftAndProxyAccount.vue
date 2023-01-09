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
      abc: "abv"
    }
  },
  methods: {
    async login(){
      ElMessageBox.prompt('Please input your UserID', 'UserID', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
      }).then(({ value }) => {
        ElMessage({
          type: 'success',
          message: `Your UserId is:${value}`,
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