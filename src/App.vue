<template>
  <router-view></router-view>
</template>

<script>
import Map from '@/views/map/index'
import { Icon } from 'leaflet'


export default {
  name: 'App',
  components: {
    'v-l-map': Map,
  },
  data: function () {
    return {}
  },
  beforeMount () {
    delete Icon.Default.prototype._getIconUrl
    Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    })
  },
}
</script>
