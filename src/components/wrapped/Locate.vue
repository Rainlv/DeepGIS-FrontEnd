<script>
import Vue2LeafletLocatecontrol from 'vue2-leaflet-locatecontrol'

export default {
  extends: Vue2LeafletLocatecontrol,
  name: 'Locate',
  data () {
    return {
      LocateOptions: {
        flyTo: true,
        drawMarker: true,
        drawcdrawCircle: true
      }
    }
  }
}
</script>

<style scoped>
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
</style>
