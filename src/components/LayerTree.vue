<template>
  <div>
    <contextmenu ref="contextmenuAssert">
      <contextmenu-item @click="handleShowLayer">添加至图层</contextmenu-item>
      <contextmenu-item @click="deleteAsset">删除资源</contextmenu-item>
      <contextmenu-item @click="downloadAsset">下载资源</contextmenu-item>
      <contextmenu-submenu title="子菜单">
        <contextmenu-item>菜单4</contextmenu-item>
        <contextmenu-item divider></contextmenu-item>
        <contextmenu-submenu title="子菜单">
          <contextmenu-item>菜单5</contextmenu-item>
        </contextmenu-submenu>
      </contextmenu-submenu>
    </contextmenu>

    <contextmenu ref="contextmenuLayerTree">
      <contextmenu-item @click="handleSetEditClick">{{ editStatus ? '取消编辑' : '设为编辑图层' }}</contextmenu-item>
      <contextmenu-item @click="handleZoomTo">缩放至图层</contextmenu-item>
      <contextmenu-item @click="handleRemoveLayer">删除图层</contextmenu-item>
      <contextmenu-item @click="handleBring2Top">置于顶层</contextmenu-item>
      <contextmenu-item @click="handleBring2Back">置于底层</contextmenu-item>
      <contextmenu-item @click="showStyleForm">样式设置</contextmenu-item>
      <contextmenu-submenu title="子菜单">
        <contextmenu-item>菜单4</contextmenu-item>
        <contextmenu-item divider></contextmenu-item>
        <contextmenu-submenu title="子菜单">
          <contextmenu-item>菜单5</contextmenu-item>
        </contextmenu-submenu>
      </contextmenu-submenu>
    </contextmenu>
    <el-row :gutter="10">
      <el-col :span="20">
        <el-input
          size="small"
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button size="small" icon="el-icon-refresh" circle @click="initAssertTree"></el-button>
      </el-col>
    </el-row>
    <!--    TODO: Lazy Load-->
    <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      node-key="id"
      :filter-node-method="filterNode"
      ref="assertTree"
      @node-contextmenu="handleAssertContextmenu"
      @node-click="handleClick"
    >
    </el-tree>
    <el-tree
      default-expand-all
      ref="layerTree"
      :data="showLayerData"
      :props="defaultProps"
      node-key="id"
      show-checkbox
      draggable
      :allow-drop="allowDrop"
      @check="checkChange"
      @node-contextmenu="handleLayerTreeContextmenu"
      @node-click="handleClick"
      @node-drop="nodeDrop"
    >
      <span class="m-el-tree-node" slot-scope="{ node, data }">
<!--        TODO 添加点线面图标-->
        <!--        <span><i v-if="node.level !== 1" class="iconfont" :class="getIconClass(data.id)"></i>{{ node.label }}</span>-->
        <span><i v-if="node.level !== 1"></i>{{ node.label }}</span>
<!--        <span v-if="node.level !== 1">-->
<!--          <el-color-picker size="mini" v-model="data.color" @change="handleColorChange($event, node)"></el-color-picker>-->
<!--        </span>-->
      </span>
    </el-tree>
    <layer-style-form ref="styleForm"></layer-style-form>
  </div>
</template>

<script>
import { geoserver_delete_asset, geoserver_download_asset, geoserver_get_user_feature_list } from '@/request/api'
import { mapActions, mapMutations, mapState } from 'vuex'
import 'v-contextmenu/dist/index.css'
import {
  directive,
  Contextmenu,
  ContextmenuItem,
  ContextmenuSubmenu,
  ContextmenuGroup,
} from 'v-contextmenu/src'
import LayerStyleForm from '@/components/LayerStyleForm'

export default {
  name: 'LayerTree',
  components: {
    LayerStyleForm,
    Contextmenu,
    ContextmenuItem,
    ContextmenuSubmenu,
    ContextmenuGroup,
  },
  directives: {
    contextmenu: directive,
  },
  data () {
    return {
      editStatus: false,
      contextNode: null,
      filterText: '',
      featureTypeMap: new Map([['Point', 'icon-dian'], ['Line', 'icon-xian'], ['Polygon', 'icon-mian']]),
      data: [{
        id: 'root',
        label: '资源目录',
        children: []
      }],
      showLayerData: [{
        id: 'root',
        label: '图层树',
        children: [],
        isLeaf: false
      }],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'isLeaf'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.assertTree.filter(val)
    },
  },
  computed: {
    ...mapState({
      'showLayers': state => state.showLayer.layers,
      'editingLayer': state => state.editLayer.activeEditLayer,
      'userInfo': state => state.user.userInfo
    })
  },
  methods: {
    ...mapMutations([
      'addShowLayer',
      'removeLayer',
      'addWMSShowLayer'
    ]),
    ...mapActions(['setActiveEditLayer']),
    showStyleForm () {
      let idx = this._getLayerIndexByID(this.contextNode.data.id)
      let activeLayer = this.showLayers[idx].layerObj.mapObject
      this.$refs.styleForm.showStyleForm(activeLayer)
    },
    // 右键菜单
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    allowDrop (draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level && draggingNode.parent.id === dropNode.parent.id) {
        return type !== 'inner'
      }
    },
    handleLayerTreeContextmenu (mousePos, nodeData, node, nodeVNode) {
      this.$refs.contextmenuAssert.hide()
      if (node.level === 1) {
        return
      }
      let idx = this._getLayerIndexByID(nodeData.id)
      this.editStatus = (this.showLayers[idx].layerObj.mapObject === this.editingLayer)
      this.$refs.contextmenuLayerTree.show({
        top: mousePos.clientY,
        left: mousePos.clientX
      })
      this.contextNode = node
    },
    handleAssertContextmenu (mousePos, nodeData, node, nodeVNode) {
      this.$refs.contextmenuLayerTree.hide()
      if (node.level === 1 || node.level === 2 || node.level === 3) {
        return
      }
      this.$refs.contextmenuAssert.show({
        top: mousePos.clientY,
        left: mousePos.clientX
      })
      this.contextNode = node
    },
    handleClick () {
      this.$refs.contextmenuLayerTree.hide()
      this.$refs.contextmenuAssert.hide()
    },

    // 图层树控制
    _getLayerIndexByID (id) {
      let [typeNS, typeName] = id.split(':', 2)
      for (let idx in this.showLayers) {
        if (this.showLayers[idx].typeNS === typeNS && this.showLayers[idx].typeName === typeName) {
          return idx
        }
      }
    },
    // handleColorChange (color, node) {
    //   let nodeData = node.data
    //   let idx = this._getLayerIndexByID(nodeData.id)
    //   this.showLayers[idx].layerObj.fillColor = nodeData.color
    // },
    checkChange (nodeData, treeStatus) {
      let idx = this._getLayerIndexByID(nodeData.id)
      if (treeStatus.checkedKeys.indexOf(nodeData.id) !== -1) {
        nodeData.color = this.showLayers[idx].layerObj.fillColor
        this.showLayers[idx].layerObj.show()
      } else {
        this.showLayers[idx].layerObj.hide()
      }
    },
    handleSetEditClick () {
      let idx = this._getLayerIndexByID(this.contextNode.data.id)
      let activeLayerObj = this.editStatus ? null : this.showLayers[idx].layerObj.mapObject
      let editLabel = null

      // 切换编辑/非编辑Label
      if (this.editStatus) {
        // 设为非编辑状态
        editLabel = this.contextNode.data.label.substr(1)
        this._pre_edit_node = null
      } else {
        // 设为编辑状态
        if (this._pre_edit_node) {
          this._pre_edit_node.data.label = this._pre_edit_node.data.label.substr(1)
        }
        editLabel = '*' + this.contextNode.data.label
        this._pre_edit_node = this.contextNode
      }
      this.$set(this.contextNode.data, 'label', editLabel)
      this.setActiveEditLayer({ layer: activeLayerObj })
    },
    handleZoomTo () {
      let idx = this._getLayerIndexByID(this.contextNode.data.id)
      let activeLayerVComp = this.showLayers[idx].layerObj
      activeLayerVComp.fitBounds()
    },
    handleBring2Top () {
      let idx = this._getLayerIndexByID(this.contextNode.data.id)
      let activeLayerVComp = this.showLayers[idx].layerObj
      activeLayerVComp.bringToFront()
    },
    handleBring2Back () {
      let idx = this._getLayerIndexByID(this.contextNode.data.id)
      let activeLayerVComp = this.showLayers[idx].layerObj
      activeLayerVComp.bringToBack()
    },
    handleRemoveLayer () {
      let idx = this._getLayerIndexByID(this.contextNode.data.id)
      let [typeNS, typeName] = this.contextNode.data.id.split(':', 2)
      this.$refs.layerTree.remove(this.contextNode.data.id)
      if (this.editingLayer === this.showLayers[idx].layerObj.mapObject) {
        this.setActiveEditLayer({ layer: null })
      }
      this.removeLayer({
        typeNS,
        typeName
      })

    },
    nodeDrop (dragNode) {
      // 拖拽后会取消勾选BUG？
      dragNode.checked && this.$refs.layerTree.setChecked(dragNode.data, true)
    },
    // 资源树控制
    handleShowLayer () {
      let {
        label,
        id,
        type
      } = this.contextNode.data

      if (type === 'feature') {
        // 矢量图层显示
        let [typeNS, typeName] = id.split(':', 2)
        if (this.$refs.layerTree.getNode(id)) {
          this.$message({
            message: `${label}已在图层中!`,
            type: 'warning'
          })
          return
        }
        this.addShowLayer({
          typeNS,
          typeName
        })
        this.$refs.layerTree.append({
          label,
          id
        }, 'root')
        this.$refs.layerTree.setChecked(id, true)
      } else if (type === 'raster') {
        // 栅格图层显示
        this.addWMSShowLayer({
          layerName: id
        })
      }

    },
    initAssertTree () {
      for (let item of this.data) {
        item.children = []
      }
      // 加载资源树
      geoserver_get_user_feature_list().then(res => {
        this.$set(this.data[0], 'children', res.result)
      })
    },
    deleteAsset () {
      let {
        label,
        id,
        type
      } = this.contextNode.data
      let [typeNS, typeName] = id.split(':', 2)
      if (!typeNS.startsWith(this.userInfo.nick_name)) {
        this.$message({
          type: 'warning',
          message: '只能删除本用户的私有资源！'
        })
      } else {
        geoserver_delete_asset({
          layer_name: typeName,
          layer_type: type
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      }
    },
    downloadAsset () {
      let {
        label,
        id,
        type
      } = this.contextNode.data
      let [typeNS, typeName] = id.split(':', 2)
      geoserver_download_asset({ feature_name: typeName })
    }
  },
  mounted () {
    this.initAssertTree()
  },
}
</script>

<style>
/* 仅子节点显示复选框 */
div[role='group'] .el-tree-node .is-leaf + .el-checkbox {
  display: inline-block;
}

.el-tree-node .el-checkbox {
  display: none;
}

.m-el-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
