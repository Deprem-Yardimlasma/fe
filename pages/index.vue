<script setup>
import BaseInput from "~/components/global/BaseInput.vue";
import HelpTable from "~/pages/components/HelpTable.vue";
// import BaseMap from "~/components/global/BaseMap.vue";

const config = useRuntimeConfig();

const tableData = ref([])
const cityData = ref([])
const townData = ref([])
const districtData = ref([])

const filterTownData = ref([])

const inputData = reactive({
    name: '',
    phone: '',
    city: '',
    town: '',
    district: '',
    apartment: ''
})

const filterData = reactive({
    city: '',
    town: ''
})

const iller = [{
    text: 'Gaziantep',
    value: 'Gaziantep'
}]

const onClickSave = async () => {
    const contract = {
        name: inputData.name,
        address: {
            city: inputData.city?.text,
            town: inputData.town?.text,
            district: inputData.district?.text,
            apartment: inputData.apartment
        }
    }
    if(inputData.phone) {
        Object.assign('phone', inputData.phone)
    }

    await useFetch('/yardim',{
        method: 'POST',
        baseURL: config.public.apiBase,
        body: contract
    })
}


const yardimResponse = await useFetch('/yardim',{
    method: 'GET',
    baseURL: config.public.apiBase,
})
tableData.value = yardimResponse.data.value.data;
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

const getTownValues = computed(() => {
  return townData.value.map(town => ({
      value: town._id,
      text: town.name
  }))
})

const getDistrictValues = computed(() => {
  return districtData.value.map(distinct => ({
      value: distinct._id,
      text: distinct.name
  }))
})

const getFilterTownValues = computed(() => {
  return filterTownData.value.map(town => ({
      value: town._id,
      text: town.name
  }))
})

const onChangeCity  = async () => {
    inputData.town = '';
    const { data } = await useFetch(`/cities/${inputData.city?.value}/towns`,{
        method: 'GET',
        baseURL: config.public.apiBase,
    })

    townData.value = data.value.data;
}
const onChangeTown  = async () => {
    inputData.distinct = '';
    const { data } = await useFetch(`/towns/${inputData.town?.value}/districts`,{
        method: 'GET',
        baseURL: config.public.apiBase,
    })

    districtData.value = data.value.data;
}
const onChangeFilterCity  = async () => {
    filterData.town = '';
    const { data } = await useFetch(`/cities/${filterData.city?.value}/towns`,{
        method: 'GET',
        baseURL: config.public.apiBase,
    })
    console.log('x', data)

    filterTownData.value = data.value.data;
}

const onClickFilter = async () => {
    const contract = {
        'address.city': filterData.city?.text,
        'address.town': filterData.town?.text,
    }

    const { data } = await useFetch('/filter',{
        method: 'POST',
        baseURL: config.public.apiBase,
        body: contract
    })

    tableData.value = data.value.data;
}

const onClickClearFilter = () => {
    filterData.city = '';
    filterData.town = '';
    tableData.value = yardimResponse.data.value.data;
}

</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="prose flex justify-center w-full max-w-full">
        <h1>Yardım Adres Bildirimi</h1>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
        <BaseSelect v-model="inputData.city" label="İl" :options="getCityValues" @change="onChangeCity" />
        <BaseSelect v-model="inputData.town" label="İlçe" :options="getTownValues" :disabled="!inputData.city" @change="onChangeTown" />
        <BaseSelect v-model="inputData.district" label="Mahalle" :disabled="!inputData.town" :options="getDistrictValues" />
    </div>
    <div class="flex flex-col md:flex-row gap-4">
        <BaseInput v-model="inputData.apartment" label="Apartman adı" />
        <BaseInput v-model="inputData.phone" label="Telefon Numarası" />
        <BaseInput v-model="inputData.name" label="İsim Soyisim" />
    </div>
    <button class="btn btn-primary btn-block" @click="onClickSave">Kaydet</button>
    <div class="prose flex justify-center w-full max-w-full mt-8">
        <h1>Kayıtlı Yardım Talepleri</h1>
    </div>
    <div class="flex flex-col md:flex-row items-center gap-4">
        <BaseSelect v-model="filterData.city" label="İl" :options="getCityValues" @change="onChangeFilterCity" />
        <BaseSelect v-model="filterData.town" label="İlçe" :options="getFilterTownValues" :disabled="!filterData.city" />
        <button class="btn btn-primary md:mt-9 w-72" @click="onClickFilter">Filtrele</button>
        <button class="btn md:mt-9 w-72" @click="onClickClearFilter">Temizle</button>
    </div>
    <HelpTable :data="tableData" />
    <!-- <ClientOnly>
        <BaseMap />
        <template #fallback> Loading map... </template>
    </ClientOnly> -->
  </div>
</template>
