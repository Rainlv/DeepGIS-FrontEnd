<template>
  <div>
    <v-easy-button :options="options"></v-easy-button>
    <create-layer ref="children"></create-layer>
  </div>
</template>

<script>
import VEasyButton from '@/components/Base/VEasyButton'
import CreateLayer from '@/components/CreateLayer'

export default {
  name: 'CreateLayerButton',
  components: {
    CreateLayer,
    VEasyButton
  },
  data () {
    return {
      visible: true,
      options: {
        position: 'topright',
        states: [{
          stateName: '',
          icon: 'el-icon-document-add fa-lg',
          title: '创建图层',
          onClick: this.changeVisible
        }]
      },
    }
  }
  ,
  methods: {
    changeVisible () {
      this.$refs.children.dialogFormVisible = true
    }
  },
}
</script>

<style scoped>
</style>
