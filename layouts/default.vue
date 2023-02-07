<template>
  <div>
      <PageHeader />
      <div class="container p-4 mx-auto">
          <slot />
      </div>
  </div>
</template>
<script setup>
const config = useRuntimeConfig();
const cityData = ref([])
const cityResponse = await useFetch('/cities',{
    method: 'GET',
    baseURL: config.public.apiBase,
})

cityData.value = cityResponse.data.value.data;

const getCityValues = computed(() => {
    return cityData.value.map(city => ({
        value: city._id,
        text: city.name
    }))
})

provide('mainContext',{
    cityData,
    getCityValues
})

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
