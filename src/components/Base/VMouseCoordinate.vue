<template>
  <div></div>
</template>

<script>
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.css'
import { findRealParent } from 'vue2-leaflet'
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.min'

const props = {
  options:{
    type: Object
  }
}
export default {
  name: 'VMeasurement',
  props,
  mounted () {
    this.mapObject = new L.Control.Coordinates(this.options)
    this.parentContainer = findRealParent(this.$parent)
    this.mapObject.addTo(this.parentContainer.mapObject)
  }
}
</script>

<style lang="scss" scoped>
</style>

