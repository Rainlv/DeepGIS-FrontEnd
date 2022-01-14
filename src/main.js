// 引入leaflet
import 'leaflet/dist/leaflet.css'
// 引入Vue相关
import Vue from 'vue'
import App from './App.vue'
// import router from './router'
// import store from './store'
import { Icon } from 'leaflet/dist/leaflet-src.esm'
import 'leaflet/dist/leaflet.css';

// Repair Leaflet Icon
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.config.productionTip = false

new Vue({
  // router,
  // store,
  render: h => h(App)
}).$mount('#app')
