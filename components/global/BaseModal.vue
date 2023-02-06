<script setup>
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const isShow = ref(props.modelValue)

watchEffect(() => {
    isShow.value = props.modelValue
})


const emit = defineEmits()
watch(isShow, () => {
    emit('update:modelValue', isShow.value)
})
</script>
<template>
    <div>
        <input
            id="my-modal-2"
            v-model="isShow"
            type="checkbox"
            class="modal-toggle"
        >
        <div class="modal">
            <div class="modal-box">
                <label for="my-modal-2" class="btn btn-sm absolute right-4 top-4">✕</label>
                <div class="form-control flex items-center">
                    <h2>
                        <slot name="header" />
                    </h2>
                </div>

                <div class="mt-4">
                    <slot />
                </div>

                <div class="modal-action">
                    <slot name="action" />
                </div>
            </div>
        </div>
    </div>
</template>
