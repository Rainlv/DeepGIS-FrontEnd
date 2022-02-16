<template>
  <div class="body-box">
    <l-map ref="map"
           :zoom="zoom"
           :center="center"
           @update:zoom="zoomUpdated"
           @update:center="centerUpdated"
           @update:bounds="boundsUpdated"
           class="map-box-view"
           :options="mapOptions"
    >
      <side-bar ref="sideBar"></side-bar>
      <layer-control ref="cl" position="topright"></layer-control>
      <l-control-scale position="bottomleft" :imperial="true" :metric="false"></l-control-scale>
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
        layer-type="base"/>

      <v-l-fullscreen position="topleft"></v-l-fullscreen>
      <v-l-search></v-l-search>
      <!--      <v-l-locate></v-l-locate>-->
      <measurement/>
      <geoman/>
      <mini-map/>
      <mouse-coordinate/>
      <create-layer-button></create-layer-button>
      <WFSLayer
        v-for="wfsLayer in wfsLayers"
        :key="wfsLayer.typeNS + ':' + wfsLayer.typeName"
        :options="{typeNS:wfsLayer.typeNS, typeName:wfsLayer.typeName}"
      >
      </WFSLayer>
      <!--      <v-maker-cluster></v-maker-cluster>-->
      <v-easy-button :options="b_options" @click="click"></v-easy-button>
      <VWMSLayer
        v-for="wmsLayer in wmsLayers"
        :key="wmsLayer.layerName"
        :options="{layers:wmsLayer.layerName}"
      ></VWMSLayer>
    </l-map>
  </div>
</template>

<script>
import 'leaflet-easybutton/src/easy-button.css'
import { LMap, LTileLayer, LControlLayers, LControlScale } from 'vue2-leaflet'
import FullScreen from '@/components/Base/VFullScreen'
import Search from '@/components/wrapped/Search'
import Locate from '@/components/wrapped/Locate'
import VChineseLayer from '@/components/Base/VChineseLayer'
import LayerControl from '@/components/wrapped/LayerControl'
import MiniMap from '@/components/wrapped/MiniMap'
import Geoman from '@/components/Base/VGeoman'
import Measurement from '@/components/wrapped/Measurement'
import MouseCoordinate from '@/components/wrapped/MouseCoordinate'
import VEasyButton from '@/components/Base/VEasyButton'
import CreateLayerButton from '@/components/wrapped/CreateLayerButton'
import WFSLayer from '@/components/wrapped/WFSLayer'
import SideBar from '@/components/SideBar'
import VWMSLayer from '@/components/Base/VWMSLayer'
import { editLayer, globalMapObj, showLayer, showWMSLayer } from '@/store/modules/map'
import { mapMutations, mapState } from 'vuex'
import VMakerCluster from '@/components/Base/VMakerCluster'

export default {
  components: {
    VMakerCluster,
    VWMSLayer,
    SideBar,
    WFSLayer,
    Measurement,
    Geoman,
    LMap,
    CreateLayerButton,
    LTileLayer,
    'v-l-fullscreen': FullScreen,
    'v-l-search': Search,
    'v-l-locate': Locate,
    VChineseLayer,
    LControlLayers,
    LayerControl,
    LControlScale,
    MiniMap,
    MouseCoordinate,
    VEasyButton,
  },
  data () {
    return {
      zoom: 5,
      center: [36.413220, 106.219482],
      bounds: null,
      mapOptions: {
        preferCanvas: true,  // 使用Canvas
        attributionControl: false
      },
      tileProviders: [
        {
          name: 'OpenStreetMap',
          visible: true,
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        },
        {
          name: 'OpenTopoMap',
          visible: false,
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        }],
      b_options: {
        position: 'topright',
        states: [{
          stateName: '',
          icon: 'fa-floppy-o fa-lg',
          title: '保存图层',
          onClick: this.click
        }]
      }
    }
  },
  computed: {
    ...mapState({
      wfsLayers: state => state.showLayer.layers,
      wmsLayers: state => state.showWMSLayer.layers,
      activeEditLayer: state => state.editLayer.activeEditLayer,
      makerClusterObj: state => state.globalMapObj.makerClusterObj
    })
  },
  methods: {
    ...mapMutations(['setMap']),
    zoomUpdated (zoom) {
      this.zoom = zoom
    },
    centerUpdated (center) {
      this.center = center
    },
    boundsUpdated (bounds) {
      this.bounds = bounds
    },
    click () {
      if (this.activeEditLayer) {
        this.activeEditLayer.save()
      } else {
        this.$message({
          message: '请设置当前编辑图层！',
          type: 'warning'
        })
      }
    },
    warnNoEditingLayer(e){
      if (!this.activeEditLayer) {
        this.$message({
          message: '当前编辑图层未设置,绘图结果可能无法保存！',
          type: 'warning'
        })
      }
    }
  },
  mounted () {
    this.setMap({ map: this.$refs.map.mapObject })
    this.$refs.map.mapObject.on('pm:drawstart', this.warnNoEditingLayer)
    // this.$refs.map.mapObject.on('pm:drawstart', this.warnNoEditingLayer)
    // this.$refs.map.mapObject.on('pm:drawstart', this.warnNoEditingLayer)
    // TODO　添加MarkerCluster
    // this.$refs.map.mapObject.on('pm:create', (e) => {
    //   e.shape === "Marker" && this.makerClusterObj.addLayer(e.layer)
    // })
  }
}
</script>

<style scoped>
.body-box {
  margin: 0;
  overflow: hidden;
  background: #fff;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
}

.map-box-view {
  height: 100%;
}
</style>
