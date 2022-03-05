<template>
  <div>
    <v-easy-button :options="options"></v-easy-button>
    <upload-form ref="children"></upload-form>
  </div>
</template>
<script>
import VEasyButton from '@/components/Base/VEasyButton'
import uploadForm from '@/views/map/components/UploadForm'

export default {
  name: 'UploadLayerBtn',
  components: {
    VEasyButton,
    uploadForm
  },
  data () {
    return {
      options: {
        position: 'topright',
        states: [{
          stateName: '',
          icon: 'fa-cloud-upload fa-lg',
          title: '上传图层',
          onClick: this.changeVisible
        }]
      },
    }
  },
  methods: {
    changeVisible () {
      this.$refs.children.dialogFormVisible = true
    }
  },
}
</script>

<style scoped>

</style>
