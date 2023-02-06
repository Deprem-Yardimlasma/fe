<script setup>
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
})
</script>
<template>
    <div class="overflow-x-auto">
        <table class="table w-full">
            <!-- head -->
            <thead>
            <tr>
                <th>İl</th>
                <th>İlçe</th>
                <th>Mahalle</th>
                <th>KİŞİ</th>
                <th>Detay</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="data in props.data" class="hover">
                  <td>{{ data.address.city }}</td>
                  <td>{{ data.address.town }}</td>
                  <td>{{ data.address.district }}</td>
                  <td :class="[data.name === 'Belirtilmemis' ? 'italic font-bold' : '']">{{ data.name }}</td>
                  <td>
                      <nuxt-link :to="`/detail/${data._id}`" class="hover:underline">Detaylı Bilgi</nuxt-link>
                  </td>
              </tr>
            </tbody>
        </table>
    </div>
</template>
