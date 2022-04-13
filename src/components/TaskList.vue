<template>
  <el-table
    :data="queue"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      sortable
      prop="id"
      label="AssetID">
    </el-table-column>
    <el-table-column
      sortable
      prop="status"
      label="状态"
      :filters="[{ text: '错误', value: downloadStatus.ERROR }, { text: '正在导出', value: downloadStatus.DOWNLOADING },  { text: '已导出', value: downloadStatus.DOWNLOADED }]"
      :filter-method="filterTag"
    >
      <template slot-scope="scope">
        <el-tag
          :type="getTagType(scope.row.status)"
          disable-transitions>{{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      prop="process"
      label="已导出/KB">
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex'
import { downloadStatus } from '@/utils/constant'

export default {
  methods: {
    tableRowClassName ({
      row,
      rowIndex
    }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    getTagType (status) {
      switch (status) {
        case downloadStatus.DOWNLOADED:
          return 'success'
        case downloadStatus.DOWNLOADING:
          return 'default'
        case downloadStatus.ERROR:
          return 'error'
        default:
          return 'default'
      }
    },
    filterTag(value, row) {
      return row.status === value
    }
  },
  data () {
    return {
      downloadStatus
    }
  },
  computed: {
    ...mapState({
      'queue': state => state.downloadQueue.queue,
    }),
  }
}
</script>

<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
