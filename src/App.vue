<template>
  <v-l-map>
  </v-l-map>
</template>

<script>
import Map from '@/views/Map'
import { Icon } from 'leaflet';

export default {
  name: 'App',
  components: {
    "v-l-map": Map,
  },
  data: function () {
    return {
      // map: ''
    }
  },
  beforeMount () {
    delete Icon.Default.prototype._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }
}
</script>
