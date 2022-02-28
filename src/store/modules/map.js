import Vue from 'vue'

export const editLayer = {
  state: () => ({
    activeEditLayer: null,  // 当前编辑图层
    activeEditFeature: null,  // 当前编辑要素

    clickFeatureInfo: {
      fid: null,
      props: {}
    },  // 点击图层的信息
    clickFeatureLayer: null,  // 点击图层
    clickFeatureElm: null,  // 点击要素
  }),
  mutations: {
    setClickFeatureElm (state, { feature }) {
      Vue.set(state, 'clickFeatureElm', feature)
    },
    setActiveEditLayer (state, { layer }) {
      Vue.set(state, 'activeEditLayer', layer)
    },
    setActiveEditFeature (state, { feature }) {
      Vue.set(state, 'activeEditFeature', feature)
    },
    setClickFeatureInfo (state, {
      fid,
      props
    }) {
      state.clickFeatureInfo = {
        fid: null,
        props: {}
      }
      Vue.set(state.clickFeatureInfo, 'fid', fid)
      for (let key in props) {
        Vue.set(state.clickFeatureInfo.props, key, props[key])
      }
    },
    editFeatureProp (state, {
      key,
      value
    }) {
      state.activeEditLayer.editLayer(state.activeEditFeature)
      Vue.set(state.clickFeatureInfo.props, key, value)
      state.activeEditFeature.setProperties({
        [key]: value
      })
    },
    setClickFeatureLayer (state, { feature }) {
      Vue.set(state, 'clickFeatureLayer', feature)
    },
  },
  actions: {
    setActiveEditLayer ({
      state,
      commit,
      rootState
    }, { layer }) {
      rootState.globalMapObj.rootMapObj.off('pm:create')
      if (state.activeEditLayer) {
        state.activeEditLayer.off('pm:edit')
        state.activeEditLayer.off('pm:remove')
        // state.activeEditLayer.off('save:failed')
        // state.activeEditLayer.off('save:success')
        rootState.globalMapObj.rootMapObj.pm.setGlobalOptions({ layerGroup: rootState.globalMapObj.rootMapObj })
      }
      if (layer) {
        rootState.globalMapObj.rootMapObj.pm.setGlobalOptions({ layerGroup: layer })
        rootState.globalMapObj.rootMapObj.on('pm:create', (e) => {
          layer.addLayer(e.layer)
        })
        layer.on('pm:edit', (e) => {
          layer.editLayer(e.layer)
        })
        layer.on('pm:remove', (e) => {
          layer.removeLayer(e.layer)
        })
      }
      commit('setActiveEditLayer', { layer })
    },

  },
  getters: {}
}

export const globalMapObj = {
  state: () => ({
    rootMapObj: null,
    sideBarObj: null,
    makerClusterObj: null
  }),
  mutations: {
    setMap (state, { map }) {
      Vue.set(state, 'rootMapObj', map)
    },
    setSideBar (state, { sideBar }) {
      Vue.set(state, 'sideBarObj', sideBar)
    },
    setMakerCluster (state, { mapObject }) {
      Vue.set(state, 'makerClusterObj', mapObject)
    },
  },
}

export const showLayer = {
  state: () => ({
    layers: [],
  }),
  mutations: {
    addLayerObj (state, {
      typeNS,
      typeName,
      layerObj
    }) {
      for (let idx in state.layers) {
        if (state.layers[idx].typeNS === typeNS && state.layers[idx].typeName === typeName) {
          Vue.set(state.layers[idx], 'layerObj', layerObj)
        }
      }
    },
    addShowLayer (state, {
      typeNS,
      typeName
    }) {
      state.layers.push({
        typeNS,
        typeName
      })
    },
    removeLayer (state, {
      typeNS,
      typeName
    }) {
      state.layers.forEach(function (val, idx, arr) {
        if (val.typeNS === typeNS && val.typeName === typeName) {
          arr.splice(idx, 1)
        }
      })
    }
  }
}

export const showWMSLayer = {
  state: () => ({
    layers: [],
  }),
  mutations: {
    addWMSLayerObj (state, {
      layerName,
      layerObj
    }) {
      for (let idx in state.layers) {
        if (state.layers[idx].layerName === layerName) {
          Vue.set(state.layers[idx], 'layerObj', layerObj)
        }
      }
    },
    addWMSShowLayer (state, {
      layerName
    }) {
      state.layers.push({
        layerName
      })
    },
    removeWMSLayer (state, {
      layerName
    }) {
      state.layers.forEach(function (val, idx, arr) {
        if (val.layerName === layerName) {
          arr.splice(idx, 1)
        }
      })
    }
  }
}
