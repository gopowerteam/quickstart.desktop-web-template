<template lang="pug">
.label-item(:style='style')
    label.label-item-label(:style='{ minWidth: `${labelMinWidth}px` }') {{ label }}
    label.label-item-value(
        :class='{ "label-item-no-wrap": !wrap }'
        :title='showTitle ? "" : value'
        :style='{ width: valueWidth }'
    ) {{ value }}
        slot
</template>

<script setup lang="ts">
import { defineProps, onMounted } from '@vue/runtime-core'
import { computed, getCurrentInstance, ref } from 'vue'

const props = defineProps({
    label: {
        type: String,
        require: true
    },
    value: {
        type: String,
        require: true
    },
    span: {
        type: Number,
        default: 1
    },
    wrap: {
        type: Boolean,
        default: false
    },
    showTitle: {
        type: Boolean,
        default: true
    }
})

const defaultConfig = {
    column: 1,
    labelWidth: 80
}

const instance = getCurrentInstance()

const config = ref(defaultConfig)

// 获取样式
const style = computed(() => {
    const column = config.value.column
    const span = Math.min(props.span, column)
    const width = (Math.round((span / column) * 10000) / 100).toFixed(2) + '%'

    return {
        width,
        maxWidth: width,
        minWidth: width
    }
})

const labelMinWidth = computed<number>(() => {
    return config.value.labelWidth as number
})

const valueWidth = computed(() => {
    return `calc(100% - ${labelMinWidth.value + 18}px)`
})

function getConfig() {
    const ctx = getCurrentInstance()
    let parent = ctx?.parent

    while (
        parent &&
        parent.vnode &&
        parent.vnode.el &&
        parent.vnode.el.className !== 'label-container'
    ) {
        parent = parent.parent
    }

    if (parent?.vnode?.el?.className === 'label-container') {
        return parent.props as any
    } else {
        defaultConfig
    }
}

onMounted(() => {
    const slot = instance?.slots?.default
    config.value = getConfig()
})
</script>

<style lang="stylus" scoped>
.label-item
    line-height 24px
    display inline-block
    padding 0 10px 15px 10px
    overflow-wrap anywhere

    &-label
        text-align right
        display inline-block
        padding-right 5px
        &::after
            padding 0 2px
            content ':'
    &-value
        padding-left 2px
        display inline-block
        vertical-align top
    &-no-wrap
        overflow-wrap unset
        white-space nowrap
        text-overflow ellipsis
        overflow hidden
</style>
