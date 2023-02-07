<script setup>
import Multiselect from "@vueform/multiselect/src/Multiselect";
import BaseInput from "~/components/global/BaseInput.vue";
import HelpTable from "~/pages/components/HelpTable.vue";
import BaseModal from "~/components/global/BaseModal.vue";
// import BaseMap from "~/components/global/BaseMap.vue";

const config = useRuntimeConfig();

let cityData = inject('cityData')

// add this to buttons and inputs.
const showLoading = ref(false)
const tableData = ref([])
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
    data: {
        name: '',
        phone: '',
        city: '',
        town: '',
        neighborhood: '',
        apartment: '',
        source: '',
        description: '',
        // TODO: add these to creation process.
        type: { value: 'seeker', text: 'Yardıma ihtiyacım var'}, // seeker, provider
        need: [], // should be multiple // ['Erzak', 'Kıyafet', 'Eşya', 'Barınak', 'Enkaz Kurtarma', 'Diğer'] 
}})

const filterData = reactive({
    city: '',
    town: ''
})

const validateValues = () => {
    if (!inputData.data.city || !inputData.data.town || !inputData.data.neighborhood || !inputData.data.source) {
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
        name: inputData.data.name,
        address: {
            city: inputData.data.city?.text,
            town: inputData.data.town?.text,
            neighborhood: inputData.data.neighborhood?.text,
            apartment: inputData.data.apartment,
            description: inputData.data.description,
        },
        source: inputData.data.source,
        need: inputData.data.need,
        type: inputData.data.type?.value
    }

    if(inputData.data.phone) {
        Object.defineProperty(contract, 'phone', {
            value: inputData.data.phone,
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
cityData = cityResponse.data.value.data;

const getCityValues = computed(() => {
  return cityData.map(city => ({
      value: city._id,
      text: city.name
  }))
})

const getTypeValues =[
    { value: 'seeker', text: 'Yardıma ihtiyacım var' },
    { value: 'provider', text: 'Yardım edebilirim' }
  ]

const getNeedTypeValues = [
    'Erzak' ,
    'Kıyafet' ,
   'Eşya' ,
   'Barınak' ,
   'Enkaz Kurtarma' ,
   'Diğer' 
  ]

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
    showLoading.value = true
    inputData.data.town = '';
    const { data } = await useFetch(`/cities/${inputData.data.city?.value}/towns`,{
        method: 'GET',
        baseURL: config.public.apiBase,
    })

    townData.value = data.value.data;
    showLoading.value = false
}
const onChangeTown  = async () => {
    showLoading.value = true
    inputData.data.distinct = '';
    const { data } = await useFetch(`/towns/${inputData.data.town?.value}/districts`,{
        method: 'GET',
        baseURL: config.public.apiBase,
    })

    neighborhoodData.value = data.value.data;
    showLoading.value = false
}
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
    }

    const { data } = await useFetch('/filter',{
        method: 'POST',
        baseURL: config.public.apiBase,
        body: contract
    })

    tableData.value = data.value.data;
    showLoading.value = false
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
  <div v-if="showLoading" class="text-center">
    <div role="status">
        <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
    </div>
</div>
  <div v-else class="flex flex-col gap-4">
    <div class="prose flex justify-center w-full max-w-full">
        <h1>Yardım Bildirimi</h1>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
        <BaseSelect v-model="inputData.data.type" label="Yardım Tipi" :options="getTypeValues" :required="true" />
        <div class="form-control w-full">
            <label class="label">
                <span class="label-text">Yardım Alanları<span class="font-bold"> (Zorunlu)</span></span>
            </label>
            <Multiselect
                    mode="multiple"
                    v-model="inputData.data.need"
                    :options="getNeedTypeValues"
            >
                <template v-slot:multiplelabel="{ values }">
                    <div class="multiselect-multiple-label">
                    {{ values.map(values => values.label).join(' ,') }}
                    </div>
                </template>
            </Multiselect>
        </div>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
        <BaseSelect v-model="inputData.data.city" label="İl" :options="getCityValues" @change="onChangeCity" :required="true" />
        <BaseSelect v-model="inputData.data.town" label="İlçe" :options="getTownValues" :disabled="!inputData.data.city" @change="onChangeTown" :required="true"/>
        <BaseSelect v-model="inputData.data.neighborhood" label="Mahalle" :disabled="!inputData.data.town" :options="getNeighborhoodValues" :required="true"/>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
        <BaseInput v-model="inputData.data.apartment" label="Apartman adı" />
        <BaseInput v-model="inputData.data.phone" label="Telefon Numarası" />
        <BaseInput v-model="inputData.data.name" label="İsim Soyisim" />
    </div>
    <div class="flex flex-col md:flex-row gap-4">
        <BaseInput v-model="inputData.data.source" label="Kaynak" :required="true" />
        <BaseInput v-model="inputData.data.description" label="Yardımcı Bilgiler" />
    </div>
    <button class="btn btn-primary btn-block" @click="onClickSave">Kaydet</button>
    <div class="prose flex justify-center w-full max-w-full mt-8">
        <h1>Kayıtlı Talepler</h1>
    </div>
    <div class="flex flex-col md:flex-row items-center gap-4">
        <BaseSelect v-model="filterData.city" label="İl" :options="getCityValues" @change="onChangeFilterCity" />
        <BaseSelect v-model="filterData.town" label="İlçe" :options="getFilterTownValues" :disabled="!filterData.city" />
        <button class="btn btn-outline md:mt-9 md:w-72 w-full" @click="onClickClearFilter">Temizle</button>
        <button class="btn md:mt-9 md:w-72 w-full" @click="onClickFilter">Filtrele</button>
    </div>
    <HelpTable :data="tableData" />
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
    <!-- <ClientOnly>
        <BaseMap />
        <template #fallback> Loading map... </template>
    </ClientOnly> -->
  </div>
</template>
<style scoped>
::v-deep .multiselect-wrapper {
    background-color: #e9e7e7;
    border-color: #bdbcbc;
    border-style: solid;
    border-width: 1px;
}
</style>
