<template lang="pug">
config-provider(:locale='zhCN')
    modal-provider
        router-view
</template>

<script setup lang="ts">
import { ModalProvider } from '@gopowerteam/vue-modal'
import '@gopowerteam/vue-modal/dist/style.css'
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/lib/locale/zh_CN'
</script>

<style lang="postcss">
@import 'ant-design-vue/dist/antd.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>

<style lang="stylus">
@import '/assets/styles/index.styl'
</style>
