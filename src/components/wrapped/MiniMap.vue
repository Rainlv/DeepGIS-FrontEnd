<script>
import VueLeafletMinimap from 'vue-leaflet-minimap'

export default {
  extends: VueLeafletMinimap,
  name: 'MiniMap',
  props: {
    layer: {
      type: Object,
      default () {
        return new L.TileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        })
      }
    },
    options: {
      type: Object,
      default () {
        return {
          position: 'bottomright',
          width: 200,
          height: 175,
          autoToggleDisplay: true,
        }
      },
    }
  },
}
</script>
