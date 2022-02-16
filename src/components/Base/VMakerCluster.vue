<template>

</template>

<script>
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import { findRealParent } from 'vue2-leaflet'
import { mapMutations } from 'vuex'

const props = {
  options: {
    type: Object
  }
}
export default {
  name: 'VMakerCluster',
  props,
  methods: {
    ...mapMutations(['setMakerCluster']),
  },
  mounted () {
    this.mapObject = L.markerClusterGroup(this.options)
    this.parentContainer = findRealParent(this.$parent)
    this._map = this.parentContainer.mapObject
    this._map.addLayer(this.mapObject)
    this.setMakerCluster({ mapObject: this.mapObject })
  }
}
</script>

<style scoped>

</style>
