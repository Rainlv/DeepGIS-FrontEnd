<template>
  <body id="poster">
  <el-form class="login-container" label-position="left" label-width="0px">
    <h3 class="login_title">注册</h3>
    <el-form-item>
      <el-input type="text" v-model="registerForm.nick_name" auto-complete="off" placeholder="请输入昵称"></el-input>
    </el-form-item>

    <el-form-item>
      <el-input type="text" v-model="registerForm.email" auto-complete="off" placeholder="请输入账号"></el-input>
    </el-form-item>

    <el-form-item>
      <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
    </el-form-item>

    <el-form-item>
      <el-input type="password" v-model="registerContext.confirmPwd" auto-complete="off" placeholder="确认密码"
                @keyup.enter.native="register">
      </el-input>
    </el-form-item>

    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%;background: #505458;border: none" @click="register"
                 :loading="loading"
                 :disabled="loading">注册
      </el-button>

      <el-row type="flex" justify="end">
        <el-link type="info" @click="toLogin">已有账号？前往登录</el-link>
      </el-row>
    </el-form-item>
  </el-form>
  </body>

</template>

<script>
import { auth_register } from '@/request/api'

export default {
  name: 'index',
  data () {
    return {
      registerForm: {
        nick_name: '',
        email: '',
        password: '',
      },
      registerContext: {
        confirmPwd: '',
      },
      responseResult: [],
      loading: false
    }
  },
  methods: {
    register () {
      if (this.loading) return
      this.loading = true
      auth_register(this.registerForm).then(res => {
        this.loading = false
        this.$message({
          message: '注册成功即将跳转至登录页面',
          type: 'success'
        })
        this.timer = setTimeout(() => {
          this.$router.push('/login')
        }, 1000)
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.$message({
          message: '注册失败！',
          type: 'error'
        })
      })
    },
    toLogin () {
      this.$router.push('/login')
    },
    beforeRouteLeave () {
      this.timer && clearTimeout(this.timer)
    }
  }
}
</script>

<style scoped>

#poster {
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

body {
  margin: 0;
  padding: 0;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 120px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}

</style>

