<template lang="pug">
.data-card(:class='{ overflow: overflow }')
    a-card(
        size='small'
        :title='title'
        :class=`{
            'w-full':fullWidth,
            'h-full':fullHeight
        }`
    )
        template(#extra v-if='$slots.action')
            .space-x-3.h-8
                slot(name='action')
        .body(v-if='!overflow')
            slot
        .wrapper.flex.flex-col(
            :style='{ height: `calc(100% - ${$slots.action ? 60 : 12}px)` }'
            v-else
        )
            .body.flex-auto.overflow-auto.px-2.py-5
                slot
            .footer.flex.flex-row-reverse.items-center.py-2(
                v-if='$slots.footer'
            )
                slot(name='footer')
</template>

<script setup lang="ts">
import { computed, defineProps, getCurrentInstance } from 'vue'

defineProps({
    title: {
        type: String
    },
    overflow: {
        type: Boolean,
        default: false
    },
    fullHeight: {
        type: Boolean
    },
    fullWidth: {
        type: Boolean
    }
})
</script>

<style lang="stylus">
.data-card.overflow
    .footer
        border-top solid 1px rgba(0,0,0,0.1)
        & > *
            margin-right 10px
</style>

<style lang="stylus">
.data-card.overflow
    .ant-card-body
        padding 0
</style>
