<template lang="pug">
.desktop.absolute.inset-0.flex.flex-col.flex-wrap.items-start.justify-start.content-start
    .application(
        v-for='app of applications'
        :key='app.name'
        @dblclick='onOpenApp(app.name)'
        @dragstart='onDragStart(app, $event)'
        @dragend='onDragEnd'
    )
        .icon: img(:src='app.icon')
        .title {{ app.title }}
    .application-recycle.absolute(
        v-if='dragging'
        @drop.prevent='onDrop'
        @dragover.prevent='onDragOver'
    )
        img.icon(:draggable='false' src='/icons/recycle.png')
    drawer
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import Drawer from './drawer.vue'
import { IStore } from '@/store'
import { computed, onMounted } from 'vue'
import { Modal } from 'ant-design-vue'
import { useGraphql } from '@/graphql'

const store = useStore(IStore)
const graphql = useGraphql()

ref: dragging = false

// 打开应用
const onOpenApp = app => {
    store.commit('app/openApp', app)
}

// 获取应用列表
const applications = computed(() => {
    return store.state.app.desktopApps.map(x =>
        store.state.app.applications.find(app => app.name === x)
    )
})

/**
 * 图标拖拽
 **/
function onDragStart(app, { dataTransfer }) {
    dragging = true

    dataTransfer.dropEffect = 'move'
    dataTransfer.setData('text/plain', app.name)
}

function onDragEnd(event) {
    dragging = false
}

function onDrop({ dataTransfer }) {
    const name = dataTransfer.getData('text')
    const app = store.state.app.applications.find(x => x.name == name)
    Modal.confirm({
        title: '删除桌面快捷方式',
        content: `是否删除创建应用 <${app.title}> 的桌面快捷方式?`,
        onOk() {
            removeDesktopApp(app)
        }
    })
}

function onDragOver(event) {
    event.preventDefault()
}

function removeDesktopApp(app) {
    graphql
        .mutation({
            removeUserDesktopApp: [
                {
                    app: app.name
                },
                {
                    result: true
                }
            ]
        })
        .then(({ removeUserDesktopApp: { result } }) => {
            store.commit('app/updateDesktopApps', result)
        })
}

// 初始化
onMounted(() => {})
</script>

<style lang="less" scoped>
.application-recycle {
    bottom: 0;
    right: 0;
    padding: 20px;
    .icon {
        width: 70px;
        height: 70px;
    }
}
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
