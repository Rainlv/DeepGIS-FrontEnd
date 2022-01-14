<script>
import VueLeafletMinimap from 'vue-leaflet-minimap'

export default {
  extends: VueLeafletMinimap,
  name: 'MiniMap',
  props: {
    layer: {
      type:Object,
      default () {
        return new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      }
    },
    options: {
      type: Object,
      default () {
        return {
          position: 'bottomright',
          width: 200,
          height: 175,
          autoToggleDisplay:true,
        }
      },
    }
  },
}
</script>
