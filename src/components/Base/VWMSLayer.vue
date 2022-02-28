<template>
  <l-tile-layer ref="layer" v-bind="$attrs"
                :tileLayerClass="getWMSLayer"
                :name="options.layers"
                layer-type="overlay"></l-tile-layer>
</template>

<script>

import { LTileLayer } from 'vue2-leaflet'
import { baseGeoserverUrl } from '@/config'
import { mapMutations } from 'vuex'

const props = {
  options: {
    type: Object,
    default () {
      return {}
    },
  },
}

export default {
  name: 'VWMSLayer',
  components: {
    LTileLayer
  },
  props,
  mounted () {
    this.layer = this.$refs.layer
    this.addWMSLayerObj({
      layerName: this.options.layers,
      layerObj: this
    })
  },
  methods: {
    ...mapMutations(['addWMSLayerObj']),
    getWMSLayer () {
      const defaultOptions = {
        format: 'image/png',
        transparent: true
      }
      return L.tileLayer.wms(baseGeoserverUrl, {
        ...defaultOptions,
        ...this.options
      })
    }
  }

}
</script>

<style scoped>

</style>
