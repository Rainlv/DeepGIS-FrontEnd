<template>
  <el-dialog title="上传矢量图层" :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             :modal="false"
             append-to-body
             v-loading="loading">
    <el-form>
      <el-form-item label="数据类型">
        <el-select v-model="dataType" placeholder="请选择数据类型">
          <el-option label="矢量" :value="GeoDataType.FEATURE"></el-option>
          <el-option label="栅格" :value="GeoDataType.RASTER"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="submitAndUpload">上 传</el-button>
    </div>
    <el-upload
      ref="uploader"
      :headers="{Authorization: token}"
      :before-upload="onBeforeUpload"
      drag
      :action="uploadAPIURL"
      multiple
      :auto-upload="false"
      :on-success="onSuccess">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">ESRI Shpfile文件等多文件数据请压缩为zip格式后上传</div>
    </el-upload>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { GeoDataType } from '@/utils/constant'

export default {
  name: 'UploadForm',
  data () {
    return {
      dataType: GeoDataType.FEATURE,
      baseUploadAPIURL: process.env.VUE_APP_BASE_API + '/api/geoserver',
      loading: false,
      dialogFormVisible: false,
      hasUploaded: false,
      GeoDataType,
      uploadAPIURL: null
    }
  },
  computed: {
    ...mapState({
      token: state => state.auth.token
    }),
  },
  watch: {
    dataType: {
      handler (newVal, _) {
        if (newVal === GeoDataType.FEATURE) {
          this.uploadAPIURL = this.baseUploadAPIURL + '/upload_shp'
        } else if (newVal === GeoDataType.RASTER) {
          this.uploadAPIURL = this.baseUploadAPIURL + '/upload_raster'
        }
      },
      immediate: true
    }
  },

  methods: {
    onSuccess () {
      this.hasUploaded = true
    },
    submitAndUpload () {
      if (this.$refs.uploader.uploadFiles.length === 0) {
        this.$message({
          message: '请选择上传文件',
          type: 'warning'
        })
        return
      }
      this.$refs.uploader.submit()
    },
    handleCancel () {
      this.dialogFormVisible = false
    },
    onBeforeUpload (file) {
    },

  }
}
</script>

<style scoped>

</style>
