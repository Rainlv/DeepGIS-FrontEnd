<template>
  <div>
    <el-descriptions title="用户信息" :column="1">
      <el-descriptions-item label="用户名">{{ userInfo.nick_name }}</el-descriptions-item>
      <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
      <el-descriptions-item label="用户类型">
        <el-tag size="small">{{ userInfo.is_superuser ? '管理员' : '普通用户' }}</el-tag>
        <el-tag size="small" v-if="userInfo.is_verified">未验证</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
    </el-descriptions>
    <el-button type="danger" size="small" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { user_info } from '@/request/api'

export default {
  name: 'UserDescriptions',
  // computed: {
  //   ...mapState({
  //     userInfo: state => state.user.userInfo
  //   })
  // },
  data () {
    return {
      userInfo: {}
    }
  },
  methods: {
    ...mapMutations(['setUserInfo', 'removeToken']),
    logout () {
      this.removeToken()
      // TODO 为硬编码，需要优化
      window.location.href = '/#/login'
    }
  },
  created () {
    user_info().then(res => {
      this.userInfo = res
      this.setUserInfo({ userInfo: res })
    })
  }

}
</script>

<style scoped>

</style>
