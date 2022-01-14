<template>
  <l-tile-layer v-bind="$attrs" :tileLayerClass="getChineseLayer"></l-tile-layer>
</template>

<script>
import { LTileLayer } from 'vue2-leaflet'
import 'leaflet.chinatmsproviders'
import { TianDiMapApi } from '@/config'

const props = {
  type: {
    type: String,
    required: true
  },
  options: {
    type: Object,
    default () {
      return { key: TianDiMapApi }
    },
  },
}
export default {
  name: 'VChineseLayer',
  props,
  components: {
    LTileLayer
  },
  inheritAttrs: true,
  data () {
    return {
      ready: false,
    }
  },
  mounted () {
  },

  methods: {
    getChineseLayer () {
      return L.tileLayer.chinaProvider(this.type, this.options)
    }
  }
}
</script>
