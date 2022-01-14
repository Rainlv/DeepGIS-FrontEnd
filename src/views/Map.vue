<template>
  <div class="body-box">
    <l-map ref="map"
           :zoom="zoom"
           :center="center"
           name="open"
           @update:zoom="zoomUpdated"
           @update:center="centerUpdated"
           @update:bounds="boundsUpdated"
           class="map-box-view"
    >

      <layer-control ref="cl" position="topright"></layer-control>
<!--      <l-control-layers ref="cl" position="topright"></l-control-layers>-->
      <l-control-scale position="topright" :imperial="true" :metric="false"></l-control-scale>

      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
        layer-type="base"/>

      <v-chinese-layer type="TianDiTu.Normal.Map" name="td_nor" layer-type="base"/>
      <v-chinese-layer type="TianDiTu.Normal.Annotion" name="td_anno" layer-type="overlay"/>

      <v-l-fullscreen position="topleft"></v-l-fullscreen>
      <v-l-search></v-l-search>
      <v-l-locate></v-l-locate>
      <mini-map/>
      <geoman/>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LControlLayers, LControlScale } from 'vue2-leaflet'
import FullScreen from '@/components/Base/VFullScreen'
import Search from '@/components/wrapped/Search'
import Locate from '@/components/wrapped/Locate'
// import '@geoman-io/leaflet-geoman-free'
// import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import VChineseLayer from '@/components/Base/VChineseLayer'
import LayerControl from '@/components/wrapped/LayerControl'
import MiniMap from '@/components/wrapped/MiniMap'
import Geoman from '@/components/Base/VGeoman'

export default {
  components: {
    Geoman,
    LMap,
    LTileLayer,
    'v-l-fullscreen': FullScreen,
    "v-l-search": Search,
    'v-l-locate': Locate,
    VChineseLayer,
    LControlLayers,
    LayerControl,
    LControlScale,
    MiniMap,
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 5,
      center: [47.413220, -1.219482],
      bounds: null,
      tileProviders: [
        {
          name: 'OpenStreetMap',
          visible: true,
          attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        },
        {
          name: 'OpenTopoMap',
          visible: false,
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution:
            'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        }]
    }
  },
  methods: {
    zoomUpdated (zoom) {
      this.zoom = zoom
    },
    centerUpdated (center) {
      this.center = center
    },
    boundsUpdated (bounds) {
      this.bounds = bounds
    }
  },
  mounted () {
    console.log('Map', this.$refs.map)
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
}

.map-box-view {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background-color: #01172a;
}
</style>
