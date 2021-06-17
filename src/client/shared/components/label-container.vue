<template lang="pug">
.label-container
    .title(v-if='title') {{ title }}
    .label-content
        slot
</template>

<script setup lang="ts">
import { defineProps } from '@vue/runtime-core'

defineProps({
    title: {
        type: String
    },
    column: {
        type: Number,
        default: 2
    },
    border: {
        type: Boolean,
        default: false
    },
    labelWidth: {
        type: Number,
        default: 80
    }
})
</script>

<style lang="stylus" scoped>
.title
    color rgba(0,0,0,0.85)
    font-size 16px
    margin-bottom 16px
    font-weight bolder
.label-content
    display flex
    flex-wrap wrap
</style>
