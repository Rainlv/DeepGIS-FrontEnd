export default {
  state: () => ({
    activeLayer: null
  }),
  mutations: {
    setActiveLayer (state, payload) {
      state.activeLayer = payload.activeLayer
    }
  },
  actions: {
    setActiveLayer ({ commit }, mapObject) {

    }
  },
  modules: {
    namespaced: true
  }
}
