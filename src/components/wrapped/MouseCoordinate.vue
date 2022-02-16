<template>

</template>

<script>
import VMouseCoordinate from '@/components/Base/VMouseCoordinate'

export default {
  name: 'MouseCoordinate',
  extends: VMouseCoordinate,
  props: {
    options: {
      type: Object,
      default () {
        return { position: 'bottomleft' }
      }
    }
  }
}
</script>

<style scoped>

</style>
