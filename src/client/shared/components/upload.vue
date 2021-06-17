<template lang="pug">
.upload
    .upload-wrapper.absolute.inset-0
        input.upload-input.h-full.w-full(
            type='file'
            @change='fileChange'
            :accept='accept'
            :multiple='multiple'
        )

    .upload-content
        slot
</template>

<script setup lang="ts">
import { defineEmit, defineProps } from '@vue/runtime-core'

const props = defineProps({
    multiple: {
        type: Boolean,
        default: false
    },
    accept: {
        type: String,
        default: '*'
    }
})

const emit = defineEmit({
    upload: files => files
})

const fileChange = ({ target }) => {
    let files = target.files

    if (!props.multiple) {
        const [file] = files
        files = file
    }

    emit('upload', files)
    target.value = ''
}
</script>

<style lang="stylus" scoped>
.upload
    position relative
.upload-wrapper
    z-index 100
    .upload-input
        opacity 0
</style>
