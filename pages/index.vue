<script setup>
import BaseInput from "~/components/global/BaseInput.vue";
import HelpTable from "~/pages/components/HelpTable.vue";
import BaseModal from "~/components/global/BaseModal.vue";
// import BaseMap from "~/components/global/BaseMap.vue";

const config = useRuntimeConfig();

const tableData = ref([])
const cityData = ref([])
const townData = ref([])
const neighborhoodData = ref([])
const userCoordinates = reactive({
    hasLocation: false,
    latitude: null,
    longitude: null,
    accuracy: null,
});
const showSuccessModal = ref(false)
const showFailureModal = ref(false)

const filterTownData = ref([])

const inputData = reactive({
    name: '',
    phone: '',
    city: '',
    town: '',
    neighborhood: '',
    apartment: '',
    source: '',
    description: '',
})

const filterData = reactive({
    city: '',
    town: ''
})

const validateValues = () => {
    if (!inputData.city || !inputData.town || !inputData.neighborhood || !inputData.source) {
        showFailureModal.value = true;
        return false
    }

    return true
}


const onClickSave = async () => {
    if (!validateValues()) {
        showFailureModal.value = true
        return
    }

    const contract = {
        name: inputData.name,
        address: {
            city: inputData.city?.text,
            town: inputData.town?.text,
            neighborhood: inputData.neighborhood?.text,
            apartment: inputData.apartment,
            source: inputData.source,
            description: inputData.description,
        }
    }
    if(inputData.phone) {
        Object.defineProperty(contract, 'phone', {
            value: inputData.phone,
            writable: true,
            enumerable: true,
            configurable: true
        })
    }
    if(userCoordinates.hasLocation) {
        Object.defineProperty(contract.address, 'geo', {
            value: {
                type: 'Point',
                "coordinates": [userCoordinates.latitude, userCoordinates.longitude]
            },
            writable: true,
            enumerable: true,
            configurable: true
        })
    }

    await useFetch('/yardim',{
        method: 'POST',
        baseURL: config.public.apiBase,
        body: contract
    })
    showSuccessModal.value = true;
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

const getNeighborhoodValues = computed(() => {
  return neighborhoodData.value.map(distinct => ({
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

    neighborhoodData.value = data.value.data;
}
const onChangeFilterCity  = async () => {
    filterData.town = '';
    const { data } = await useFetch(`/cities/${filterData.city?.value}/towns`,{
        method: 'GET',
        baseURL: config.public.apiBase,
    })

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

const setPosition = (position) => {
    const coords = position.coords;
    const {latitude, longitude, accuracy} = coords;

    userCoordinates.latitude = latitude;
    userCoordinates.longitude = longitude;
    userCoordinates.accuracy = accuracy;
    userCoordinates.hasLocation = true;
}
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    }
}

if(process.client) {
    getLocation();
}
</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="prose flex justify-center w-full max-w-full">
        <h1>Yardım Adres Bildirimi</h1>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
        <BaseSelect v-model="inputData.city" label="İl" :options="getCityValues" @change="onChangeCity" :required="true" />
        <BaseSelect v-model="inputData.town" label="İlçe" :options="getTownValues" :disabled="!inputData.city" @change="onChangeTown" :required="true"/>
        <BaseSelect v-model="inputData.neighborhood" label="Mahalle" :disabled="!inputData.town" :options="getNeighborhoodValues" :required="true"/>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
        <BaseInput v-model="inputData.apartment" label="Apartman adı" />
        <BaseInput v-model="inputData.phone" label="Telefon Numarası" />
        <BaseInput v-model="inputData.name" label="İsim Soyisim" />
    </div>
    <div class="flex flex-col md:flex-row gap-4">
        <BaseInput v-model="inputData.source" label="Kaynak" :required="true" />
        <BaseInput v-model="inputData.description" label="Yardımcı Bilgiler" />
    </div>
    <button class="btn btn-primary btn-block" @click="onClickSave">Kaydet</button>
    <div class="prose flex justify-center w-full max-w-full mt-8">
        <h1>Kayıtlı Yardım Talepleri</h1>
    </div>
    <div class="flex flex-col md:flex-row items-center gap-4">
        <BaseSelect v-model="filterData.city" label="İl" :options="getCityValues" @change="onChangeFilterCity" />
        <BaseSelect v-model="filterData.town" label="İlçe" :options="getFilterTownValues" :disabled="!filterData.city" />
        <button class="btn btn-outline md:mt-9 md:w-72 w-full" @click="onClickClearFilter">Temizle</button>
        <button class="btn md:mt-9 md:w-72 w-full" @click="onClickFilter">Filtrele</button>
    </div>
    <BaseModal v-model="showSuccessModal">
        <template #header>
            İşlem Başarılı
        </template>
        Yardım talebiniz alınmıştır.
    </BaseModal>
    <BaseModal v-model="showFailureModal">
        <template #header>
            İşlem Başarısız
        </template>
        Lütfen zorunlu alanları doldurunuz.
    </BaseModal>
    <HelpTable :data="tableData" />
    <!-- <ClientOnly>
        <BaseMap />
        <template #fallback> Loading map... </template>
    </ClientOnly> -->
  </div>
</template>
