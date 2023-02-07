<script setup>
const props = defineProps({
    modelValue: {
            type: [String, Number, Object],
            default: ''
    },
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
    disabled: {
        type: Boolean,
        default: false
    },
    required: {
            type: Boolean,
            default: false
    },
    tooltip: {
        type: String,
        default: ''
    }
})

const emit = defineEmits()

const onInput = (val) => {
    emit('update:modelValue', props.options.find(option => option.value === val.target.value))
}
</script>
<template>
    <div class="form-control w-full">
        <label v-if="props.label" class="label">
            <span class="label-text">{{ props.label }}<span class="font-bold" v-if="props.required"> (Zorunlu)</span></span>
            <div v-if="props.tooltip" class="tooltip tooltip-left mb-3 p-0 h-2" :data-tip="props.tooltip">
                <Icon name="eva:info-fill" size="1rem" />
            </div>
        </label>
        <select class="select select-bordered" :disabled="props.disabled" @input="onInput" :required="props.required">
            <option disabled :selected="!modelValue">Seçiniz</option>
            <option v-for="option in props.options" :value="option.value" :key="option.value" :selected="modelValue.value === option.value">
                {{ option.text }}
            </option>
        </select>
    </div>
</template>
