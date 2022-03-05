<template>
  <el-dialog
    title="创建矢量图层"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    append-to-body
    v-loading="loading">
    <el-form :model="form" :rules="rules">
      <el-form-item label="矢量图层名称" :label-width="formLabelWidth" prop="layer_name">
        <el-input v-model="form.layer_name" autocomplete="off" placeholder="请输入图层名称"></el-input>
      </el-form-item>
      <el-form-item label="矢量类型" :label-width="formLabelWidth">
        <el-select v-model="form.geo_type" placeholder="请选择矢量类型">
          <el-option label="点" value="POINT"></el-option>
          <el-option label="线" value="LINESTRING"></el-option>
          <el-option label="面" value="POLYGON"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        :label-width="formLabelWidth"
        v-for="(field, index) in form.fields"
        :label="'字段' + (index+1)"
        :key="field.key"
        prop="fields"
      >
        <el-col :span="8">
          <el-input v-model="form.fields[index].field_name" autocomplete="off" placeholder="请输入字段名称"></el-input>
        </el-col>
        <el-select v-model="form.fields[index].field_type" placeholder="请选择数据类型"
                   style="padding-left: 20px;padding-right: 20px">
          <el-option label="整型" value="Integer"></el-option>
          <el-option label="浮点型" value="Float"></el-option>
          <el-option label="字符串" value="String"></el-option>
          <el-option label="日期" value="DateTime"></el-option>
        </el-select>
        <el-button type="danger" @click.prevent="removeField(field.key)">删除</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button @click="addField">新增字段</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { geoserver_create_table } from '@/request/api'
import { isValidLayerName } from '@/utils/validator'

export default {
  name: 'CreateLayer',
  data () {
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('名称不能为空'))
      } else if (value.toString().length > 18) {
        callback(new Error('长度应小于18个字符'))
      } else if (!isValidLayerName(value)) {
        callback(new Error('应以字母开头，且只能包含字母、数字和下划线'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      dialogFormVisible: false,
      form: {
        layer_name: '',
        geo_type: '',
        fields: []
      },
      formLabelWidth: '120px',
      rules: {
        layer_name: [{
          required: true,
          validator: validateName,
          trigger: 'blur'
        }],
        fields: [{
          required: true,
          message: "字段名称不能为空",
          trigger: 'blur'
        }],
      }
    }
  },
  methods: {
    addField () {
      this.form.fields.push({
        field_name: '',
        key: Date.now(),
        field_type: ''
      })
    },
    _reset_form_data () {
      this.form = {
        layer_name: '',
        geo_type: '',
        fields: []
      }
    },
    _close_dialog () {
      this.dialogFormVisible = false
      this._reset_form_data()
    },

    handleCancel () {
      this._close_dialog()
    },

    handleConfirm () {
      this.loading = true
      // geoserver_create_table(JSON.parse(JSON.stringify(this.form))).then(res => {
      geoserver_create_table(this.form).then(res => {
        this.loading = false
        this.$alert('创建图层成功!', '执行成功', { showCancelButton: false }).then(() => {
          this._close_dialog()
        })
      }).catch(res => {
        this.loading = false
        this.$alert(`创建图层失败!${res.message}`, '执行失败', { showCancelButton: false })
      })
    },
    removeField (key) {
      this.form.fields.forEach(function (item, index, arr) {
        if (item.key === key) {
          arr.splice(index, 1)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
