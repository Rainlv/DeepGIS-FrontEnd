<script>
// Modify from https://github.com/mikeu/vue2-leaflet-fullscreen/blob/master/LControlFullscreen.vue

import LeafletFullscreen from 'leaflet-fullscreen'
import { OptionsMixin, ControlMixin, propsBinder, optionsMerger, findRealParent } from 'vue2-leaflet'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
export default {
  name: 'LControlFullscreen',
  mixins: [
    ControlMixin,
    OptionsMixin,
  ],
  mounted () {
    const options = optionsMerger({
      ...this.controlOptions,
      options: this.options,
    }, this);
    this.mapObject = new L.Control.Fullscreen(options);
    propsBinder(this, this.mapObject, this.$options.props);
    this.parentContainer = findRealParent(this.$parent)
    this.mapObject.addTo(this.parentContainer.mapObject);
  },
  render () {
    return null;
  },
};
</script>
