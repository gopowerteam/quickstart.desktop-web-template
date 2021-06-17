<template lang="pug">
.task-bar
    .application.flex.justify-center.justify-items-center(
        v-for='app in applications'
        :key='app.name'
        :class='{ active: app.active }'
        @click='onActiveApp(app)'
    )
        .icon: img(:src='app.icon')
</template>

<script setup lang="ts">
import { ApplicationList } from '@/config/application.config'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { IStore } from '@/store'

const store = useStore(IStore)

// 应用列表
const applications = store.state.app.applicationInstances
// 激活应用
const onActiveApp = app => {
    if (!app.minimize && app.active) {
        store.commit('app/minimizeApp', app.id)
    } else {
        store.commit('app/activeApp', app.id)
    }
}
</script>

<style lang="less" scoped>
.task-bar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
}
.application {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
    height: 90%;
    padding: 0 10px;
    margin: 0 3px;
    cursor: pointer;

    .icon {
        width: 28px;
        height: 28px;

        img {
            border-radius: 3px;
        }
    }

    &.active {
        &::before {
            display: block;
            position: absolute;
            top: 0px;
            width: 20px;
            height: 2px;
            background: #fff;
            border-radius: 5px;
            content: '';
        }
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
