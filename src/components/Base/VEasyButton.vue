<template>
  <div></div>
</template>

<script>
import { findRealParent } from 'vue2-leaflet'
import 'leaflet-easybutton'
import 'leaflet-easybutton/src/easy-button.css'

const props = {
  options:{
    type: Object
  }
}
export default {
  name: 'VEasyButton',
  props,
  mounted () {
    this.mapObject = L.easyButton(this.options)
    this.parentContainer = findRealParent(this.$parent)
    this.mapObject.addTo(this.parentContainer.mapObject)
  }
}
</script>

<style lang="scss" scoped>
</style>

