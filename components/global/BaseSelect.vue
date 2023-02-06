<script setup>
const props = defineProps({
    options: {
        type: Array,
        default: () => []
    },
    placeholder: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
})
const emit = defineEmits()

const onInput = (val) => {
    emit('update:modelValue', val.target.value)
}
</script>
<template>
    <div class="form-control w-full">
        <label v-if="props.label" class="label">
            <span class="label-text">{{ props.label }}</span>
        </label>
        <select class="select select-bordered" @input="onInput">
            <option disabled selected>Seçiniz</option>
            <option v-for="option in props.options" :value="option.value">
                {{ option.text }}
            </option>
        </select>
    </div>
</template>
