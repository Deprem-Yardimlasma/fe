<script setup>
const props = defineProps({
        modelValue: {
            type: [String, Number],
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'text'
        }
    }
)

const emit = defineEmits()

const onInput = (val) => {
    emit('update:modelValue', val.target.value)
}
</script>
<template>
    <div class="form-control w-full">
        <label v-if="props.label" class="label">(
            <span class="label-text">{{props.label}}<span class="font-bold" v-if="props.required"> (Zorunlu)</span></span>
        </label>
        <input
            class="input input-bordered w-full"
            :placeholder="props.placeholder"
           :type="props.type"
           :value="modelValue"
           @input="onInput"
           :required="props.required"
        />
    </div>
</template>
