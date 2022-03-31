<template>
  <body id="poster">
  <el-form ref="form" class="login-container" label-position="left" label-width="0px" :model="loginForm">
    <h3 class="login_title">登录</h3>
    <el-form-item>
      <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入账号"></el-input>
    </el-form-item>

    <el-form-item>
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"
                @keyup.enter.native="login"></el-input>
    </el-form-item>

    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%;background: #505458;border: none" @click="login" :loading="loading"
                 :disabled="loading">登录
      </el-button>

      <el-row type="flex" justify="end">
        <el-link type="info" @click="toRegister">没有账号？前往注册</el-link>
      </el-row>
    </el-form-item>
  </el-form>
  </body>

</template>

<script>
import { auth_login } from '@/request/api'
import { mapMutations } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      responseResult: [],
      loading: false
    }
  },
  methods: {
    ...mapMutations(['setUserInfo', 'setToken']),
    login () {
      if (this.loading) return
      this.$refs.form.validate(value => {
        if (!value) {
          this.$message({
            message: '请按规则填写表单信息',
            type: 'warning'
          })
          return
        }
        this.loading = true
        auth_login(this.loginForm).then((res) => {
          this.loading = false
          this.setToken({
            access_token: res.access_token,
            token_type: res.token_type
          })
          if (this.$route.query.redirect) {
            this.$router.push(this.$route.query.redirect)
          } else {
            this.$router.push('/')
          }
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '登录失败！账号或密码错误',
            type: 'error'
          })
          this.reset()
        })
      })
    },
    reset () {
      this.$set(this.loginForm, 'password', '')
    },
    toRegister () {
      this.$router.push('/register')
    }
  },

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
  margin: 150px auto;
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
