<template>
  <el-form :model.sync="clickFeatureInfo" :label-width="labelWidth">
    <el-form-item label="要素ID">
      <el-input v-model="clickFeatureInfo.fid" disabled></el-input>
    </el-form-item>
    <el-form-item
      v-for="(value,key) in clickFeatureInfo.props"
      :label="key"
      :key="key"
    >
      <el-input :value="value" @input="editProps($event,key)"
                :disabled="clickFeatureLayer !== activeEditLayer"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import { editLayer } from '@/store/modules/map'

export default {
  name: 'FeatureProps',
  data () {
    return { labelWidth: '100px' }
  },
  props: {
    disabled: Boolean
  },
  methods: {
    ...mapMutations(['setClickFeatureInfo', 'editFeatureProp']),
    editProps (value, key) {
      this.editFeatureProp({
        key,
        value
      })
    }
  },
  computed: {
    ...mapState({
      clickFeatureInfo: state => state.editLayer.clickFeatureInfo,
      clickFeatureLayer: state => state.editLayer.clickFeatureLayer,
      activeEditLayer: state => state.editLayer.activeEditLayer,
    }),

  },
  beforeDestroy () {
    // 解决auto的label宽度销毁时的报错
    this.labelWidth = "0"
  }
}

</script>

<style scoped>

</style>
