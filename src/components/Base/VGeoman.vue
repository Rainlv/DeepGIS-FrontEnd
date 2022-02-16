<template>
  <div/>
</template>

<script>
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import { findRealParent } from 'vue2-leaflet'

export default {
  name: 'Geoman',
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }

  },
  mounted () {
    this.parentContainer = findRealParent(this.$parent)
    this._map = this.parentContainer.mapObject
    this.pm = this._map.pm
    this.pm.addControls(this.options)
    this.pm.setLang('zh')
  }
}
</script>

<style>

</style>
