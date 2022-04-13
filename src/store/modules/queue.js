import Vue from 'vue'

export const downloadQueue = {
  state: () => ({
    queue: []  // {id, status, progress}
  }),
  mutations: {
    addQueue (state, payload) {
      state.queue.push(payload)
    },
    removeQueue (state, id) {
      state.queue.forEach(function (val, idx, arr) {
        if (val.id === id) {
          arr.splice(idx, 1)
        }
      })
    },
    clearQueue (state) {
      state.queue = []
    },
    updateQueue (state, payload) {
      let rawState = state.queue
      state.queue.forEach(function (val, idx, arr) {
        if (val.id === payload.id) {
          let originPayload = arr[idx]
          payload = { ...originPayload, ...payload }
          Vue.set(state.queue, idx, payload)
        }
      })
    }
  },
  actions: {},
  getters: {}
}
