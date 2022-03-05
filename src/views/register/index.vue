<template>
  <body id="poster">
  <el-form :model="registerForm" class="login-container" label-position="left" label-width="0px" :rules="rules">
    <h3 class="login_title">注册</h3>
    <el-form-item prop="nick_name">
      <el-input type="text" v-model="registerForm.nick_name" auto-complete="off" placeholder="请输入昵称"></el-input>
    </el-form-item>

    <el-form-item prop="email">
      <el-input type="text" v-model="registerForm.email" auto-complete="off" placeholder="请输入账号"></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
    </el-form-item>

    <el-form-item prop="confirmPwd">
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
import { isValidNickname } from '@/utils/validator'

export default {
  name: 'index',
  data () {
    const validateNickname = (rule, value, callback) => {
      if (!value) {
        callback(new Error('昵称不能为空'))
      } else if (value.toString().length < 3 || value.toString().length > 18) {
        callback(new Error('昵称长度为3 - 18个字符'))
      } else if (!isValidNickname(value)) {
        callback(new Error('昵称以字母开头 长度在3~18之间 只能包含字母、数字和下划线'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else if (value.toString().length < 6 || value.toString().length > 18) {
        callback(new Error('密码长度为6 - 18个字符'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
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
      loading: false,
      rules: {
        nick_name: [{
          required: true,
          validator: validateNickname,
          trigger: 'blur'
        }, {}],
        email: [{
          required: true,
          message: '请输入邮箱地址',
          trigger: 'blur'
        },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }],
        password: [{
          required: true,
          validator: validatePassword,
          trigger: 'blur'
        }],
        confirmPwd: [{
          required: true,
          validator: validateConfirmPassword,
          trigger: 'blur',
        }],
      },
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

