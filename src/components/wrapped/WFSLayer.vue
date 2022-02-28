<template>
</template>

<script>
import VWFSTLayer from '@/components/Base/VWFSTLayer'
import { mapMutations } from 'vuex'

export default {
  name: 'WFSLayer',
  extends: VWFSTLayer,
  props: {
    options: {
      type: Object,
      default () {
        return {
          forceMulti: true,
          url: 'http://101.200.150.149:7132/geoserver/ows',
          typeNS: 'tiger',
          typeName: 'poly_landmarks',
          geometryField: 'the_geom',
          crs: L.CRS.EPSG4326,
          style: {
            fillColor: 'cyan',
            color: 'pink'
          }
        }
      }
    }
  },
}
</script>

<style scoped>

</style>
