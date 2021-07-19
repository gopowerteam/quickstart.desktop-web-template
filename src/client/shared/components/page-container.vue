<template lang="pug">
.page-container.absolute.inset-0
    .page-header-wrapper.flex.flex-row.justify-between.pt-5.px-5(
        v-if='$slots.action || title || showBack'
    )
        .page-title-wrapper
            .title.flex.items-center {{ title }}
        .page-action-wrapper.space-x-3
            a-button(v-if='showBack' @click='onBack') 返回
            slot(name='action')
    .page-body-wrapper.space-y-1(
        :class=`{
            absolute: full,
            'inset-x-5': full,
            'inset-y-2': full,
            'page-header-fixed': full && ($slots.action || title || showBack),
            'my-2': !full,
            'mx-5': !full
        }`
    ) 
        slot
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

const props = defineProps({
    full: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        default: ''
    },
    back: {
        type: Boolean,
        default: true
    },
    beforeBack: {
        type: Function,
        default: null
    }
})

const navigate = inject('navigate') as any

const showBack = computed(() => {
    return (
        props.back && navigate && navigate.routes && navigate.routes.length > 1
    )
})

function onBack() {
    navigate.back({ callback: props.beforeBack })
}
</script>

<style lang="stylus" scoped>
.page-container
    background #FAFAFA
    overflow auto
.page-header-wrapper
    .page-title-wrapper
        .title
            font-size 18px
            font-weight bold
            color rgba(0,0,0,0.7)
            &::before
                content ' '
                display inline-block
                margin-right 5px
                height 20px
                width 5px
                background-color #1890ff
                border-radius 5px
.page-body-wrapper
    overflow auto
    &.page-header-fixed
        top 60px
</style>
