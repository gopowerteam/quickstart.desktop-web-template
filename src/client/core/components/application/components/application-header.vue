<template lang="pug">
.application-header.flex.items-center(
    @mousedown.prevent='onDragStart'
    @dblclick='onMax'
)
    .info-container.flex
        .icon: img(:src='app.icon')
        .title {{ app.title }}
    .tool-container.flex.flex-row
        MinSvg.icon(@click.stop.prevent='onMin')
        MaxSvg.icon(@click.stop.pervent='onMax')
        CloseSvg.icon(@click.stop.prevent='onClose')
</template>

<script setup lang="ts">
import { inject } from 'vue'
import MaxSvg from '@/assets/icons/svg/max.svg'
import MinSvg from '@/assets/icons/svg/min.svg'
import CloseSvg from '@/assets/icons/svg/close.svg'
import { useStore } from 'vuex'

import { IStore } from '@/store'

const store = useStore(IStore)
const app = inject('app') as any
const position = inject('position') as any
let posX = 0
let posY = 0

// #region 窗口控制
const onClose = () => {
    // 最小化app
    store.commit('app/minimizeApp', app.id)
    // 动画延迟关闭
    setTimeout(() => {
        store.commit('app/closeApp', app.id)
    }, 300)
}

const onMax = () => {
    store.commit('app/maximizeApp', { id: app.id })
}

const onMin = () => {
    store.commit('app/minimizeApp', app.id)
}

// 拖动处理
const onDragMove = e => {
    const left = posX - e.clientX
    const top = posY - e.clientY
    posX = e.clientX
    posY = e.clientY

    position.top -= top
    position.left -= left
}

// 结束拖动监听
const onDragEnd = () => {
    if (position.top < 0) position.top = 0
    document.removeEventListener('mouseup', onDragEnd)
    document.removeEventListener('mousemove', onDragMove)
    store.commit('app/updateAppDragging', app.id)
}

// 开始拖动监听
const onDragStart = e => {
    if (app.maximize) return

    posX = e.clientX
    posY = e.clientY

    document.addEventListener('mouseup', onDragEnd)
    document.addEventListener('mousemove', onDragMove)
    store.commit('app/updateAppDragging', app.id)
}
// #endregion
</script>

<style lang="less" scoped>
.application-header {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    user-select: none;

    .info-container {
        flex: 1;
        display: flex;
        align-items: center;

        .icon {
            width: 20px;
            height: 20px;
            margin: 0 10px;
        }
        .title {
            font-size: 12px;
            flex: 1;
            user-select: none;
        }
    }
    .tool-container {
        padding-right: 3px;
        .icon {
            margin: 0 4px;
            width: 15px;
            height: 15px;
            border: solid 1px transparent;

            &:hover {
                border: solid 1px rgba(200, 200, 200, 0.2);
                background-color: rgba(200, 200, 200, 0.2);
            }

            &:active {
                border: solid 1px rgba(200, 200, 200, 0.1);
                background-color: rgba(200, 200, 200, 0.1);
            }
        }
    }
}
</style>
