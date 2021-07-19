<template lang="pug">
.column-container.flex.flex-row.relative(
    :style='{ width: "100%", height: "100%" }'
    :class='`space-x-${gap}`'
)
    slot
</template>

<script setup lang="ts">
defineProps({
    full: {
        type: Boolean,
        default: true
    },
    gap: {
        type: Number,
        default: 3
    }
})
</script>

<style lang="stylus" scoped></style>
