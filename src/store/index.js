import Vue from 'vue'
import Vuex from 'vuex'
import { editLayer, globalMapObj, showLayer, showWMSLayer } from '@/store/modules/map'
import { auth, user } from '@/store/modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    editLayer,
    globalMapObj,
    showLayer,
    showWMSLayer,
    user,
    auth
  }
})
