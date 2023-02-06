<script setup>
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits()

const isShow = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value)
    }
});
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
                <label class="btn btn-sm absolute right-4 top-4" @click="isShow = false">✕</label>
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
