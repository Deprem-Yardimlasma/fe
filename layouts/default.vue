<template>
  <div>
      <PageHeader />
      <div class="container p-4 mx-auto">
          <slot />
      </div>
  </div>
</template>
<script setup>
const cityData = ref([])
provide(cityData, 'cityData')
</script>