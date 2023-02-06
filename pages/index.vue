<script setup>
import BaseInput from "~/components/global/BaseInput.vue";
import HelpTable from "~/pages/components/HelpTable.vue";

const iller = [{
    text: 'Gaziantep',
    value: 'Gaziantep'
}]
</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="prose flex justify-center w-full max-w-full">
        <h1>Yardım Adres Bildirimi</h1>
    </div>
    <div class="flex flex-row gap-4">
        <BaseSelect label="İl" :options="iller" />
        <BaseSelect label="İlçe" :options="iller" />
        <BaseSelect label="Mahalle" :options="iller" />
    </div>
    <div class="flex flex-row gap-4">
        <BaseInput label="Apartman adı" />
        <BaseInput label="Telefon Numarası" />
        <BaseInput label="İsim Soyisim" />
    </div>
    <button class="btn btn-block">Kaydet</button>
    <div class="prose flex justify-center w-full max-w-full mt-8">
        <h1>Kayıtlı Yardım Talepleri</h1>
    </div>
    <div class="flex flex-row items-center gap-4">
        <BaseSelect label="İl" :options="iller" />
        <BaseSelect label="İlçe" :options="iller" />
        <button class="btn mt-9 w-72">Filtrele</button>
    </div>
    <HelpTable />
  </div>
</template>
