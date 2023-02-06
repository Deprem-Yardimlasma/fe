<script setup>
const route = useRoute()
</script>
<template>
  <div>
      {{ route.params.detailId }}
  </div>
</template>
