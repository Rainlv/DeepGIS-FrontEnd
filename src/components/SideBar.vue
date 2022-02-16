<template>
  <div id="sidebar" class="leaflet-sidebar collapsed">
    <!-- Nav tabs -->
    <div class="leaflet-sidebar-tabs">
      <ul role="tablist"> <!-- top aligned tabs -->
        <li><a href="#layerTree" role="tab"><i class="fa fa-bars"></i></a></li>
        <li><a href="#featureProps" role="tab"><i class="fa fa-table"></i></a></li>
<!--        <li><a href="#profile" role="tab"><i class="fa fa-user"></i></a></li>-->
      </ul>

      <ul role="tablist"> <!-- bottom aligned tabs -->
        <li><a href="#profile" role="tab"><i class="fa fa-user"></i></a></li>
        <li><a href="#settings" role="tab"><i class="fa fa-gear"></i></a></li>
      </ul>
    </div>

    <!-- Tab panes -->
    <div class="leaflet-sidebar-content">
      <div class="leaflet-sidebar-pane" id="featureProps">
        <h1 class="leaflet-sidebar-header">
          要素属性
          <div class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></div>
        </h1>
        <div style="margin-top: 20px">
          <feature-props></feature-props>
        </div>
      </div>

      <div class="leaflet-sidebar-pane" id="layerTree">
        <h1 class="leaflet-sidebar-header">图层管理
          <div class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></div>
        </h1>
        <div style="margin-top: 10px">
          <layer-tree></layer-tree>
        </div>
      </div>

      <div class="leaflet-sidebar-pane" id="profile">
        <h1 class="leaflet-sidebar-header">个人信息
          <div class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></div>
        </h1>
        <div style="margin-top: 10px">
          <user-descriptions></user-descriptions>
        </div>
      </div>
      <div class="leaflet-sidebar-pane" id="settings">
        <h1 class="leaflet-sidebar-header">设置
          <div class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></div>
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
import 'leaflet-sidebar-v2'
import { findRealParent } from 'vue2-leaflet'
import 'leaflet-sidebar-v2/css/leaflet-sidebar.min.css'
import FeatureProps from '@/components/FeatureProps'
import { mapMutations } from 'vuex'
import LayerTree from '@/components/LayerTree'
import UserDescriptions from '@/components/UserDescriptions'

export default {
  name: 'SideBar',
  components: {
    FeatureProps,
    LayerTree,
    UserDescriptions
  },
  mounted () {
    this.mapObject = L.control.sidebar({
      autopan: false,       // whether to maintain the centered map point when opening the sidebar
      closeButton: true,    // whether t add a close button to the panes
      container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
      position: 'right',     // left or right
    })

    this.parentContainer = findRealParent(this.$parent)
    this._map = this.parentContainer.mapObject
    this._map.addControl(this.mapObject)
    this.setSideBar({ sideBar: this.mapObject })
  },
  methods: {
    ...mapMutations(['setSideBar'])
  }
}
</script>

<style scoped>
</style>
