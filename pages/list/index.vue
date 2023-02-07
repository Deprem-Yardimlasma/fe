<script setup>
import HelpTable from "~/pages/components/HelpTable.vue";
const config = useRuntimeConfig();

let { getCityValues } = inject('mainContext')

const showLoading = ref(false)
const tableData = ref([])
const filterTownData = ref([])
const filterData = reactive({
    city: '',
    town: '',
    type: { value: 'seeker', text: 'Yardıma ihtiyacım var'},
    page: { value: '0', text: '0' },
    size: { value: '20', text: '20' },
})

const getTypeValues =[
    { value: 'seeker', text: 'Yardıma ihtiyacım var' },
    { value: 'provider', text: 'Yardım edebilirim' }
]

const initialParams = {
    page: 0,
    size: 20
}

const yardimResponse = await useFetch(`/yardim?page=${initialParams.page}&size=${initialParams.size}`,{
    method: 'GET',
    baseURL: config.public.apiBase,
})

tableData.value = yardimResponse?.data?.value?.data;
const createProperModel = (number) => {
    const arr = []
    for(let i = 1; i <= number; i++) {
        arr.push({
            value: `${i}`,
            text: `${i}`,
        })
    }
    return arr
}
const getSizeValues = [
    { value: '10', text: '10' },
    { value: '20', text: '20' },
    { value: '50', text: '50' },
    { value: '100', text: '100' },
]
const getPageValues = createProperModel(yardimResponse?.data?.value?.totalPages)

const getFilterTownValues = computed(() => {
    return filterTownData.value.map(town => ({
        value: town._id,
        text: town.name
    }))
})
const onChangeFilterCity  = async () => {
    showLoading.value = true
    filterData.town = '';
    const { data } = await useFetch(`/cities/${filterData.city?.value}/towns`,{
        method: 'GET',
        baseURL: config.public.apiBase,
    })

    filterTownData.value = data.value.data;
    showLoading.value = false
}

const onClickFilter = async () => {
    showLoading.value = true
    const contract = {
        'address.city': filterData.city?.text,
        'address.town': filterData.town?.text,
        'type': filterData.type?.value,
    }

    const params = {
        page: (filterData.page?.value * 1) || 0,
        size: (filterData.size?.value * 1) || 20
    }

    const { data } = await useFetch(`/filter?page=${params.page}&size=${params.size}`,{
        method: 'POST',
        baseURL: config.public.apiBase,
        body: contract
    })

    tableData.value = data?.value?.data;
    showLoading.value = false
}

const onClickClearFilter = () => {
    filterData.city = '';
    filterData.town = '';
    filterData.type = { value: 'seeker', text: 'Yardıma ihtiyacım var'};
    tableData.value = yardimResponse?.data?.value?.data;
}
</script>
<template>
    <div class="flex flex-col gap-4">
        <div class="prose flex justify-center w-full max-w-full mt-8">
            <h1>Kayıtlı Talepler</h1>
        </div>
        <div class="flex flex-col md:flex-row items-center gap-4">
            <BaseSelect v-model="filterData.city" label="İl" :options="getCityValues" @change="onChangeFilterCity" />
            <BaseSelect v-model="filterData.town" label="İlçe" :options="getFilterTownValues" :disabled="!filterData.city" />
        </div>
        <div class="flex flex-col md:flex-row items-center gap-4">
            <BaseSelect v-model="filterData.page" label="Sayfa Numarası" :options="getPageValues" />
            <BaseSelect v-model="filterData.size" label="Sayfa Başı Gösterilen Talep Sayısı" :options="getSizeValues" />
        </div>
        <div class="flex flex-col md:flex-row items-center gap-4">
            <BaseSelect v-model="filterData.type" label="Yardım Tipi" :options="getTypeValues" />
            <button class="btn btn-outline md:mt-9 md:w-72 w-full" @click="onClickClearFilter">Temizle</button>
            <button class="btn md:mt-9 md:w-72 w-full" @click="onClickFilter">Filtrele</button>
        </div>
        <HelpTable :data="tableData" />
    </div>
</template>
