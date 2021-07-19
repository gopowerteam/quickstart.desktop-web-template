<template lang="pug">
.column-item(:style='columnItemStyle')
    slot
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    overflow: {
        type: Boolean,
        default: false
    },
    width: {
        type: String,
        default: undefined
    },
    flex: {
        type: Number,
        default: undefined
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
