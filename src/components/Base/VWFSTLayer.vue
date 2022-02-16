<template>
</template>

<script>
import { findRealParent } from 'vue2-leaflet'
import 'leaflet-wfst'
import { baseGeoserverUrl } from '@/config'
import { mapMutations, mapState } from 'vuex'
import { geoserver_get_feature_type } from '@/request/api'

const props = {
  options: {
    type: Object
  }
}

export default {
  name: 'VWFSTLayer',
  props,
  data () {
    return {
      loaded: false,
      gmlType: null,
      fillColor: '#00ffff',
    }
  },
  computed: {
    ...mapState({
      clickFeatureLayer: state => state.editLayer.clickFeatureLayer,
      activeEditLayer: state => state.editLayer.activeEditLayer,
      clickFeatureElm: state => state.editLayer.clickFeatureElm,
    }),
    activeColor () {
      return this.reverseColor(this.fillColor)
    }
  },
  mounted () {
    let defaultOptions = {
      url: baseGeoserverUrl,
      geometryField: 'the_geom',
      crs: L.CRS.EPSG4326,
      bubblingMouseEvents: false,
      style: {
        color: 'black',
        weight: 1,
        fillColor: this.fillColor
      },
    }
    let layerName = this.options.typeNS + ':' + this.options.typeName
    const gmlTypeList = ['Point', 'Line', 'Polygon']
    geoserver_get_feature_type(layerName).then(res => {
      // 获取图层类型和GML字段
      console.log(res)
      for (let field of res.featureTypes[0].properties) {
        if (field.type.startsWith('gml:')) {
          defaultOptions.geometryField = field.name
          for (const gml of gmlTypeList) {
            if (field.localType.includes(gml)) {
              // 点/线/面
              this.gmlType = gml
            }
            if (field.localType.startsWith('Multi')) {
              defaultOptions = {
                ...defaultOptions,
                forceMulti: true
              }
            }
          }
        }
      }
      // 初始化图层
      this.parentContainer = findRealParent(this.$parent)
      this._map = this.parentContainer.mapObject
      this.mapObject = new L.WFST({ ...defaultOptions, ...this.options })
      const allowDrawType = {
        Point: ['Marker', 'CircleMarker'],
        Line: ['Line'],
        Polygon: ['Rectangle', 'Polygon', 'Circle']
      }

      // 编辑时控制可编辑形状
      this._map.on('pm:drawstart', (e) => {
        if (this.activeEditLayer !== this.mapObject) {
          return
        }
        let drawShape = e.shape
        if (allowDrawType[this.gmlType].indexOf(drawShape) === -1) {
          this.$message({
            message: `编辑图层类型为${this.gmlType},无法使用"${drawShape}"编辑工具`,
            type: 'warning'
          })
          this._map.pm.disableDraw()
        }
      })

      // 图层加载完成时显示
      this.mapObject.once('load', () => {
        this.loaded = true
        // 阻止事件冒泡到map
        this.mapObject.eachLayer((layer) => {
          layer.options.bubblingMouseEvents = false
        })
        this.show()
      })
      let sideBar = this.$store.state.globalMapObj.sideBarObj

      // 图层中要素点击事件
      let styleFlag = false
      this.mapObject.on('click', (e) => {
        // 编辑状态，阻止点击事件
        if (this.isEditing()) {
          return
        }
        styleFlag = !!e.layer.setStyle
        if (this.clickFeatureElm === e.layer) {
          styleFlag && this.clickFeatureElm.setStyle({ fillColor: this.fillColor })
          sideBar.close()
          this.setClickFeatureElm({ feature: null })
        } else {
          // 切换点击要素
          this.setClickFeatureLayer({ feature: this.mapObject })
          this.clickFeatureElm && this.clickFeatureElm.setStyle && this.clickFeatureElm.setStyle({ fillColor: this.fillColor })
          styleFlag && e.layer.setStyle({
            fillColor: this.activeColor
          })
          this.setClickFeatureElm({ feature: e.layer })

          if (this.mapObject === this.activeEditLayer) {
            this.setActiveEditFeature({
              feature: e.layer
            })
          }
          let props = e.layer.feature.properties
          // 没有属性的要素(新添加的未赋值要素)用图层字段来赋空值
          if (Object.keys(props).length === 0) {
            for (let key in e.target.readFormat.featureType.fieldTypes) {
              props[key] = null
            }
          }
          this.setClickFeatureInfo({
            fid: e.layer.feature.id,
            props: props
          })
          sideBar.open('featureProps')
        }
      })
      this.mapObject.on('save:success', (e) => {
        this.$message({
          message: `${this.options.typeNS}:${this.options.typeName}保存成功`,
          type: 'success'
        })
      })
      this.mapObject.on('save:failed', (e) => {
        console.log(e)
        this.$message({
          message: `${this.options.typeNS}:${this.options.typeName}保存失败`,
          type: 'error'
        })
      })
      // store
      this.addLayerObj({
        typeNS: this.options.typeNS,
        typeName: this.options.typeName,
        layerObj: this
      })
    }).catch(err => {
      this.$message({
        message: '加载矢量数据失败！',
        type: 'error'
      })
      console.error('Loading WFSLayer occurred error:', err)
    })
  },
  methods: {
    ...mapMutations([
      'setClickFeatureInfo',
      'setActiveEditFeature',
      'setClickFeatureLayer',
      'addLayerObj',
      'setClickFeatureElm'
    ]),
    show () {
      this.mapObject.addTo(this._map)
      this.loaded && this.fitBounds()
    },
    hide () {
      this._map.removeLayer(this.mapObject)
    },
    fitBounds () {
      let bounds = this.mapObject.getBounds()
      if (!bounds.isValid()) {
        this.$message({
          message: '缩放到图层失败,无法获取图层范围!',
          type: 'warning'
        })
      } else {
        this._map.fitBounds(bounds)
      }
    },
    isEditing () {
      return this._map.pm.globalCutModeEnabled()
        || this._map.pm.globalDragModeEnabled()
        || this._map.pm.globalDrawModeEnabled()
        || this._map.pm.globalRemovalModeEnabled()
        || this._map.pm.globalEditModeEnabled()
        || this._map.pm.globalRotateModeEnabled()
    },
    // 反转颜色
    reverseColor (oldColor) {
      oldColor = '0x' + oldColor.replace(/#/g, '')
      let str = '000000' + (0xFFFFFF - oldColor).toString(16)
      return '#' + str.substring(str.length - 6, str.length)
    },
    bringToFront () {
      this.mapObject.eachLayer((layer) => {
        layer.bringToFront()
      })
    }
  },
  watch: {
    fillColor (newVal, _) {
      if (this.gmlType === 'Point') {
        this.$message({
          message: '无法修改点要素的颜色',
          type: 'warning'
        })
      } else if (this.gmlType === 'Polygon') {
        this.mapObject.eachLayer((layer) => {
          if (layer === this.clickFeatureElm) {
            layer.setStyle && layer.setStyle({ fillColor: this.activeColor })
          } else {
            layer.setStyle && layer.setStyle({ fillColor: newVal })
          }
        })
      } else if (this.gmlType === 'Line') {
        this.mapObject.eachLayer((layer) => {
          if (layer === this.clickFeatureElm) {
            layer.setStyle && layer.setStyle({ color: this.activeColor })
          } else {
            layer.setStyle && layer.setStyle({ color: newVal })
          }
        })
      }
    }
  },
  destroyed () {
    this._map.removeLayer(this.mapObject)
    delete this.mapObject
  }
}
</script>

<style scoped>

</style>
