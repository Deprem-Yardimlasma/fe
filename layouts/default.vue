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

useHead({
  titleTemplate: 'Toplumsal Yardımlaşma Platformu - %s',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  title: 'Anasayfa',
  meta: [
    { name: 'description', content: 'Toplumsal yardımlaşmamızı artırmak için oluşturduğumuz sayfa.' }
  ],
})
</script>