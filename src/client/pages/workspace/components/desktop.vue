<template lang="pug">
.desktop.absolute.inset-0.flex.flex-col.flex-wrap.items-start.justify-start.content-start
    .application(
        v-for='app of applications'
        :key='app.name'
        @dblclick='onOpenApp(app.name)'
    )
        .icon: img(:src='app.icon')
        .title {{ app.title }}
    drawer
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import Drawer from './drawer.vue'
import { IStore } from '@/store'
import { computed, onMounted } from 'vue'

const store = useStore(IStore)

// 打开应用
const onOpenApp = app => {
    store.commit('app/openApp', app)
}

// 获取应用列表
const applications = computed(() => {
    return store.state.app.desktopApps
        .filter(x => store.state.app.userApplications.includes(x))
        .map(x => store.state.app.applications.find(app => app.name === x))
})

// 初始化
onMounted(() => {})
</script>

<style lang="less" scoped>
.application {
    margin: 5px 20px;
    padding: 5px;
    width: 100px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: solid 1px rgba(255, 255, 255, 0);
    border-radius: 5px;
    user-select: none;
    .icon {
        width: 60px;
        height: 60px;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 5px 10px;
        img {
            padding: 5px;
            border-radius: 10px;
        }
    }
    .title {
        height: 2em;
        font-size: 10px;
        color: #fff;
        width: 8em;
        text-align: center;
    }

    &:hover {
        border: solid 1px rgba(255, 255, 255, 0.2);
        background-color: rgba(255, 255, 255, 0.2);
    }

    &:active {
        border: solid 1px rgba(255, 255, 255, 0.1);
        background-color: rgba(255, 255, 255, 0.1);
    }
}
</style>
