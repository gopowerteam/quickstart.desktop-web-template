<template lang="pug">
a-button.m-10(type='primary' @click='onEnter') 应用内跳转测试
</template>

<script setup lang="ts">
import { inject } from 'vue'

const navigate = inject('navigate') as any

const onEnter = () => {
    navigate.push({
        component: () => import('./test-page-1.vue')
    })
}
</script>
