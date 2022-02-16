<template>
  <VEasyButton :options="b_options"></VEasyButton>
</template>

<script>
import VEasyButton from '@/components/Base/VEasyButton'

export default {
  name: 'LayerSaveButton',
  extends: VEasyButton,
  components:{
    VEasyButton
  },
  props: {
    options: {
      type: Object,
      default () {
        return {
          position: 'topright',
          states: [{
            stateName: '',
            icon: 'fa-list-ul',
            title: '保存图层',
            onClick: this.changeVisible
          }]
        }
      }
    }
  },
  data(){
    return {
      b_options:{
        position: 'topright',
        states: [{
          stateName: '',
          icon: 'fa-tree',
          title: '保存图层',
          onClick: this.changeVisible
        }]
      }
    }
  }
}
</script>

<style scoped>

</style>
