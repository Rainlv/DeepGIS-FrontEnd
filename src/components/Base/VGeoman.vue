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
    this.pm = this.parentContainer.mapObject.pm
    this.pm.addControls(this.options)
    this.pm.setLang('zh');
  }
}
</script>

<style>

</style>
