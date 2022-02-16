<template>
  <div>
    <el-row>
      <el-col>
        <el-table :data="form_data.data" class="tb-edit" style="width: 100%" highlight-current-row
                  @row-click="handleCurrentChange" size="mini" @focusout="">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="字段名" width="180">
            <template v-slot="scope">
              <el-input size="small" v-model="scope.row.date" placeholder="请输入内容"
                        @change="handleEdit(scope.$index, scope.row)"></el-input>
              <span>{{ scope.row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column label="字段类型" width="180">
            <template v-slot="scope">
              <el-select v-if="scope.$index == 0"
                         v-model="scope.row.geoType" placeholder="请选择" size="small">
                <el-option
                  v-for="item in geo_type"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <el-select v-else
                         v-model="scope.row.geoType" placeholder="请选择" size="small">
                <el-option
                  v-for="item in field_type"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <span>{{ scope.row.geoType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span=24>
        <div class="el-table-add-row" style="width: 99.2%;" @click="addMasterUser"><span>+ 添加</span></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'EditableTable',
  data () {
    return {
      form_data: {
        data: [{
          date: '2016-05-02',
          geoType: '点',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          geoType: '点',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      },
      geo_type: ['点', '线', '面'],
      field_type: ['整型', '浮点型', '字符串', '日期']
    }
  },
  methods: {
    handleCurrentChange (row, event, column) {
      // console.log(row, event, column, event.currentTarget)
    },
    handleEdit (index, row) {
      // console.log(index)
      // console.log(index, row)
    },
    handleDelete (index, row) {
      this.form_data.data.splice(index, 1)
    },
    addMasterUser () {
      let default_field = {
        date: '',
        geoType: '',
        address: ''
      }
      this.form_data.data.push(default_field)
    }
  }
}
</script>

<style scoped>
.el-table-add-row {
  margin-top: 10px;
  width: 100%;
  height: 34px;
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  cursor: pointer;
  justify-content: center;
  display: flex;
  line-height: 34px;
}

.tb-edit .el-input {
  display: none
}

.tb-edit .el-select {
  display: none
}

.tb-edit .current-row .el-input {
  display: block
}

.tb-edit .current-row .el-select {
  display: block
}

.tb-edit .current-row .el-input + span {
  display: none
}

.tb-edit .current-row .el-select + span {
  display: none
}
</style>
