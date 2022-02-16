<template>
  <div></div>
</template>

<script>
import 'leaflet-measure/dist/leaflet-measure.cn'
import { findRealParent } from 'vue2-leaflet'
import "leaflet-measure/dist/leaflet-measure.css";

const props = {
  options:{
    type: Object
  }
}
export default {
  name: 'VMeasurement',
  props,
  mounted () {
    this.mapObject = new L.Control.Measure(this.options)
    this.parentContainer = findRealParent(this.$parent)
    this.mapObject.addTo(this.parentContainer.mapObject)
  }
}
</script>

<style lang="scss" scoped>
</style>

