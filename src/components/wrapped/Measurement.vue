<template>

</template>

<script>
import VMeasurement from '@/components/Base/VMeasurement'

export default {
  name: 'Measurement',
  extends: VMeasurement,
  props: {
    options: {
      type: Object,
      default () {
        return { position: 'topleft' }
      }
    }
  }
}
</script>

<style scoped>

</style>
