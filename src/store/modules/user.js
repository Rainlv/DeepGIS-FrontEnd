import Vue from 'vue'

export const user = {
  state: () => ({
    userInfo: null,
  }),
  mutations: {
    setUserInfo (state, { userInfo }) {
      state.userInfo = userInfo
    }
  }
}

export const auth = {
  state: () => ({
    token: window.localStorage.getItem('token')
  }),
  mutations: {
    setToken (state, {
      access_token,
      token_type
    }) {
      let token = token_type + ' ' + access_token
      state.token = token
      window.localStorage.setItem('token', token)
    },
    removeToken (state) {
      window.localStorage.removeItem('token')
      state.token = null
    }
  }
}
