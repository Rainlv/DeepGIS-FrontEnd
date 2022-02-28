<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    :close-on-click-modal="false"
    :modal="false"
    :title="'样式设置'"
    v-dialogDrag
  >
    <el-form ref="form" :model="styleForm" label-width="100px" size="mini">
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

    <span slot="footer" class="dialog-footer">
      <el-button @click="_closeStyleForm">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
      <el-button type="primary" @click="handleApply">应 用</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LayerStyleForm',
  computed: {
    ...mapState({
      clickFeature: state => state.editLayer.clickFeatureElm,
      clickLayer: state => state.editLayer.clickFeatureLayer,
    })
  },
  data () {
    return {
      editObj: null,
      dialogVisible: false,
      styleForm: {
        borderColor: null,
        borderTransparency: 100,
        borderWidth: 1,
        borderType: null,
        fillColor: null,
        fillTransparency: 100
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
    },
    showStyleForm (layer) {
      this.editObj = layer
      this.dialogVisible = true
    },
    _closeStyleForm () {
      this.editObj = null
      this.dialogVisible = false
      this.styleForm = {
        borderColor: null,
        borderTransparency: 100,
        borderWidth: 1,
        borderType: null,
        fillColor: null,
        fillTransparency: 100
      }
    },
    handleApply(){
      this.editObj.eachLayer(feature => {
        feature.setStyle({
          weight: this.styleForm.borderWidth / 5,
          color: this.styleForm.borderColor,
          opacity: this.styleForm.borderTransparency / 100,
          fillColor: this.styleForm.fillColor,
          fillOpacity: this.styleForm.fillTransparency / 100
        })
      })
      this.clickFeature && this.clickFeature.setStyle({
        fillColor: this.reverseColor(this.styleForm.fillColor),
      })
    },
    handleConfirm () {
      this.handleApply()
      this._closeStyleForm()
    }
  }
}
</script>

<style scoped>

</style>
