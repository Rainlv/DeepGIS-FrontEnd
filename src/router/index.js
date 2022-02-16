import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index'),
    meta: {}
  },
  {
    name: 'index',
    path: '/',
    component: () => import('@/views/Map'),
    meta: {
      needLogin: true
    }
  }
]

const router = new VueRouter({
  routes
})

// 路由登录状态判断！
router.beforeEach((to, from, next) => {
  if (to.meta.needLogin) {  //判断该路由是否需要权限
    if (store.state.auth.token) {  //判断store是否有登录信息
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }  //将该路由path传入login页面，登陆成功后跳转到该页面
      })
    }
  } else {
    next()
  }
})
export default router
