<script>
import VGeosearch from 'vue2-leaflet-geosearch'
import { OpenStreetMapProvider } from 'leaflet-geosearch'

export default {
  extends: VGeosearch,
  props: {
    options: {
      type: Object,
      default () {
        return {
          provider: new OpenStreetMapProvider(),
          style: '',
          notFoundMessage: 'Sorry, that address could not be found.',
        }
      }

    }
  }
}
</script>
