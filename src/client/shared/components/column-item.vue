<template lang="pug">
.column-item(:style='columnItemStyle')
    slot
</template>

<script setup lang="ts">
import { computed, defineProps } from '@vue/runtime-core'

const props = defineProps({
    overflow: {
        type: Boolean,
        default: false
    },
    width: {
        type: String
    },
    flex: {
        type: Number
    },
    scrollable: {
        type: Boolean,
        default: false
    }
})

const columnItemStyle = computed(() => {
    return Object.assign(
        {},
        props.width
            ? {
                  width: props.width
              }
            : {},
        props.flex
            ? {
                  flex: props.flex
              }
            : {}
    )
})
</script>
