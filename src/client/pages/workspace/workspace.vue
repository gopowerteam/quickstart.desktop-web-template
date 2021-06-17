<template lang="pug">
.workspace
    .systembar-container
        system-bar
    .desktop-container.flex-auto.overflow-hidden(ref='desktopContainer')
        desktop
        application(v-for='app in applications' :key='app.name' :app='app')
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import Desktop from './components/desktop.vue'
import { useStore } from 'vuex'
import Application from '@/core/components/application/application.vue'
import SystemBar from './components/system-bar.vue'
import { IStore } from '@/store'

const store = useStore(IStore)

// 用户列表
const applications = store.state.app.applicationInstances
// 桌面容器
const desktopContainer = ref<any>()
// 屏幕宽度
const screenWidth = ref(0)
// 屏幕高度
const screenHeight = ref(0)

provide('screenWidth', screenWidth)
provide('screenHeight', screenHeight)

const updateContainerSize = () => {
    if (desktopContainer.value) {
        screenWidth.value = desktopContainer.value.clientWidth
        screenHeight.value = desktopContainer.value.clientHeight
    }
}

onMounted(() => {
    // 更新窗口尺寸
    updateContainerSize()

    // 如果窗口大小改变更新尺寸
    window.addEventListener('resize', () => {
        updateContainerSize()
    })
})
</script>

<style lang="stylus" scoped>
.workspace
    z-index 0
    position absolute
    top 0
    bottom 0
    right 0
    left 0
    background-image url('/wallpapers/wallpaper-01.jpg')
    background-size 100% 100%

    .systembar-container
        flex-basis 40px
        min-height 40px
        position relative

    .desktop-container
        height calc(100% - 40px)
        position: relative
</style>
