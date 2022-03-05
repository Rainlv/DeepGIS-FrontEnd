<template>
  <el-dialog title="上传矢量图层" :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             :modal="false"
             append-to-body
             v-loading="loading">
    <el-upload
      :headers="{Authorization: token}"
      drag
      :action="uploadAPIURL"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传矢量文件，ESRI Shpfile文件请压缩为zip格式后上传</div>
    </el-upload>
  </el-dialog>
</template>

<script>
import { uploadAPIURL } from '@/config'
import { mapState } from 'vuex'

export default {
  name: 'UploadForm',
  data () {
    return {
      uploadAPIURL,
      loading: false,
      dialogFormVisible: false
    }
  },
  computed: {
    ...mapState({
      token: state => state.auth.token
    })
  }
}
</script>

<style scoped>

</style>
