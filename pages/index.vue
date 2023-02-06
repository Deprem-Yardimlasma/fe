<script setup>
import BaseInput from "~/components/global/BaseInput.vue";
import HelpTable from "~/pages/components/HelpTable.vue";
// import BaseMap from "~/components/global/BaseMap.vue";

const config = useRuntimeConfig();

const data = ref([{
    name: 'x',
    phone: 'y',
    city: 'z',
    town: '',
    district: '',
    apartment: ''
}])
const tableHeaders = ref(['İl', 'İlçe', 'Mahalle', 'Detay'])
const inputData = reactive({
    name: '',
    phone: '',
    city: '',
    town: '',
    district: '',
    apartment: ''
})

const iller = [{
    text: 'Gaziantep',
    value: 'Gaziantep'
}]

const onClickSave = async () => {
    const contract = {
        name: inputData.name,
        phone: inputData.phone,
        city: inputData.city,
        town: inputData.town,
        district: inputData.district,
        apartment: inputData.apartment
    }

    const { data } = await useFetch('/post-data',{
        method: 'POST',
        baseURL: config.public.apiBase,
        body: contract
    })

    return data
}

const fillData = async () => {

}
</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="prose flex justify-center w-full max-w-full">
        <h1>Yardım Adres Bildirimi</h1>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
        <BaseSelect v-model="inputData.city" label="İl" :options="iller" />
        <BaseSelect v-model="inputData.town" label="İlçe" :options="iller" />
        <BaseSelect v-model="inputData.district" label="Mahalle" :options="iller" />
    </div>
    <div class="flex flex-col md:flex-row gap-4">
        <BaseInput v-model="inputData.apartment" label="Apartman adı" />
        <BaseInput v-model="inputData.phone" label="Telefon Numarası" />
        <BaseInput v-model="inputData.name" label="İsim Soyisim" />
    </div>
    <button class="btn btn-block" @click="onClickSave">Kaydet</button>
    <div class="prose flex justify-center w-full max-w-full mt-8">
        <h1>Kayıtlı Yardım Talepleri</h1>
    </div>
    <div class="flex flex-col md:flex-row items-center gap-4">
        <BaseSelect label="İl" :options="iller" />
        <BaseSelect label="İlçe" :options="iller" />
        <button class="btn md:mt-9 w-72">Filtrele</button>
    </div>
    <HelpTable :data="data" :headers="tableHeaders" />
    <!-- <ClientOnly>
        <BaseMap />
        <template #fallback> Loading map... </template>
    </ClientOnly> -->
  </div>
</template>
