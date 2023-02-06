<script setup>
const route = useRoute()
const config = useRuntimeConfig();

const { data } = await useFetch(`/yardim/${route.params.detailId}`,{
    method: 'GET',
    baseURL: config.public.apiBase,
})
const response = data.value.data;
</script>
<template>
    <div class="flex flex-col gap-4">
        <div class="prose flex justify-center w-full max-w-full">
            <h1>Yardım Bildirimi</h1>
        </div>
        <div class="prose">
            <h2>Kişi Bilgileri</h2>
            <ul>
                <li>İsim Soyisim: {{ response.name }}</li>
                <li>Telefon: {{ response.phone }}</li>
            </ul>
            <h2>Adres Bilgileri</h2>
            <ul>
              <li>İl: {{ response.address.city }}</li>
              <li>İlçe: {{ response.address.town }}</li>
              <li>Mahalle: {{ response.address.neighborhood }}</li>
              <li>Apartman: {{ response.address.apartment }}</li>
              <li>Adres: {{ response.address.addressText }}</li>
            </ul>
        </div>
    </div>
</template>
