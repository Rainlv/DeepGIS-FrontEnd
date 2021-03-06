import axios from 'axios'
import QS from 'qs'
import router from '@/router'
import store from '@/store/index'
// json格式请求头
const headerJSON = {
  'Content-Type': 'application/json;charset=UTF-8'
}
// FormData格式请求头
const headerFormData = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
}

const axios_instance = axios.create({
  timeout: 10000, // 请求超时时间
  baseURL: process.env.VUE_APP_BASE_API,
  headers: headerJSON,
})
// 请求拦截器
axios_instance.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = store.state.auth.token
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.error(error)
  })

// 响应拦截器
axios_instance.interceptors.response.use(
  response => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是200的情况
  error => {
    console.log(error)
    if (error.response && error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
          break
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          // Toast({
          //   message: '登录过期，请重新登录',
          //   duration: 1000,
          //   forbidClick: true
          // });
          // 清除token
          // localStorage.removeItem('token');
          // store.commit('loginSuccess', null);
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath
              }
            })
          }, 1000)
          break
        // 404请求不存在
        case 404:
          // Toast({
          //   message: '网络请求不存在',
          //   duration: 1500,
          //   forbidClick: true
          // });
          break
        // 其他错误，直接抛出错误提示
        // default:
        //   Toast({
        //     message: error.response.data.message,
        //     duration: 1500,
        //     forbidClick: true
        //   });
      }
      return Promise.reject(error.response)
    }
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} config [请求配置]
 */
export function get (url, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios_instance.get(url, {
      params: params,
      ...config
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} config [请求配置]
 * @param {Boolean} json [是否发送Json数据]
 */
export function post (url, params, json = true, config = {}) {

  return new Promise((resolve, reject) => {
    axios_instance.post(url, json ? JSON.stringify((params)) : QS.stringify(params),
      { headers: json ? headerJSON : headerFormData, ...config })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * delete，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} config [请求配置]
 */
export function del (url, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios_instance.delete(url, {
      params: params,
      ...config
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 文件下载请求
 * @param url {String}
 * @param params {Object}
 * @param config {Object}
 * @param fileType {String}
 * @param onDownloadProgressFunc {Function}
 * @param onStart {Function}
 * @param onSuccess {Function}
 * @param onErr {Function}
 */
export function download (url, params, config, fileType, onDownloadProgressFunc, onStart, onSuccess, onErr) {
  let res = onStart && onStart()
  if (onStart && !res) return
  axios_instance.get(url, {
    params: params,
    responseType: 'blob',
    timeout: 30000,
    onDownloadProgress: onDownloadProgressFunc || (() => {
    }),
    ...config
  })
    .then(res => {
      const {
        data,
        headers
      } = res
      let fileName = null
      if (headers['content-disposition']) {
        fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
      } else {
        let timestamp = new Date().getTime()
        fileName = `${timestamp}.${fileType}`
      }
      const blob = new Blob([data], { type: headers['content-type'] })
      let dom = document.createElement('a')
      let url = window.URL.createObjectURL(blob)
      dom.href = url
      dom.download = decodeURI(fileName)
      dom.style.display = 'none'
      document.body.appendChild(dom)
      dom.click()
      dom.parentNode.removeChild(dom)
      window.URL.revokeObjectURL(url)
      onSuccess && onSuccess(fileName)
    })
    .catch(err => {
      onErr && onErr(err)
      console.log(err)
    })
}
