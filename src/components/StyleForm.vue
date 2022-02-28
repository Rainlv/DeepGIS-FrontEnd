<template>
  <el-form ref="form" :model="styleForm" label-width="100px" size="mini">
    <h2>{{ clickFeature.feature.id }}</h2>
    <h2>边框设置</h2>
    <el-form-item label="边框颜色">
      <el-color-picker v-model="styleForm.borderColor"></el-color-picker>
    </el-form-item>
    <el-form-item label="边框透明度">
      <el-slider v-model="styleForm.borderTransparency" :format-tooltip="formatOpacity"></el-slider>
    </el-form-item>
    <el-form-item label="边框宽度">
      <el-slider v-model="styleForm.borderWidth" :format-tooltip="(val) => val / 5"></el-slider>
    </el-form-item>
    <el-form-item label="边框线型">
      <el-select v-model="styleForm.borderType" placeholder="请选择线型">
        <el-option
          v-for="item in borderOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <h2>填充设置</h2>
    <el-form-item label="填充颜色">
      <el-color-picker v-model="styleForm.fillColor"></el-color-picker>
    </el-form-item>
    <el-form-item label="填充透明度">
      <el-slider v-model="styleForm.fillTransparency" :format-tooltip="formatOpacity"></el-slider>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'StyleForm',
  data () {
    return {
      styleForm: {
        borderColor: null,
        borderTransparency: null,
        borderWidth: null,
        borderType: null,
        fillColor: null,
        fillTransparency: null
      },
      borderOptions: [
        {
          label: '实线',
          value: 'solid'
        },
        {
          label: '虚线',
          value: 'dash'
        },
      ]
    }
  },
  computed: {
    ...mapState({
      clickFeature: state => state.editLayer.clickFeatureElm,
      clickLayer: state => state.editLayer.clickFeatureLayer,
    })
  },
  beforeMount () {
    this.setStyleForm(this.clickFeature.options)
  },
  watch: {
    styleForm: {
      handler (newVal, oldVal) {
        if (!oldVal) return
        let styleObj = {
          weight: newVal.borderWidth / 5,
          color: newVal.borderColor,
          opacity: newVal.borderTransparency / 100,
          fillColor: this.reverseColor(newVal.fillColor),
          fillOpacity: newVal.fillTransparency / 100
        }
        this.clickFeature.setStyle(styleObj)
      },
      deep: true
    },
    clickFeature (newFeature, _) {
      this.setStyleForm(newFeature.options)
    }
  },
  methods: {
    reverseColor (oldColor) {
      oldColor = '0x' + oldColor.replace(/#/g, '')
      let str = '000000' + (0xFFFFFF - oldColor).toString(16)
      return '#' + str.substring(str.length - 6, str.length)
    },
    setStyleForm (options) {
      this.$set(this.styleForm, 'borderWidth', options.weight * 5)
      this.$set(this.styleForm, 'borderColor', options.color)
      this.$set(this.styleForm, 'borderTransparency', options.opacity * 100)
      this.$set(this.styleForm, 'fillColor', this.reverseColor(options.fillColor))
      this.$set(this.styleForm, 'fillTransparency', options.fillOpacity * 100)
    },
    formatOpacity (val) {
      return val / 100
    }
  }
}
</script>

<style scoped>
/*.leaflet-styleEditor-stroke {*/
/*  display: block;*/
/*  height: 20px;*/
/*  width: 150px;*/
/*  background-repeat: no-repeat;*/
/*  border: 1px solid white;*/
/*  background-image: url(data:image/png;base64,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);*/
/*  cursor: pointer;*/
/*}*/

/*.leaflet-styleEditor-stroke:hover {*/
/*  border: 1px solid black;*/
/*}*/
</style>
