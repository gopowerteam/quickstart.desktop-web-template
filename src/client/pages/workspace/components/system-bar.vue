<template lang="pug">
.system-bar
    .menu
        AppMenuSvg.icon(@click='onOpen')
    .taskbar-container
        task-bar
    .tool-container
        tool-bar
teleport(to='body')
    transition(name='application-center-fade')
        .application-center-wrapper.absolute.inset-0(v-if='visible')
            application-center.h-full.w-full
</template>

<script setup lang="ts">
import { computed, defineComponent, inject, provide, ref } from 'vue'
import TaskBar from './task-bar.vue'
import ToolBar from './tool-bar.vue'
import AppMenuSvg from '@/assets/icons/svg/app.svg'
import ApplicationCenter from '@/components/application-center.vue'

const visible = ref(false)

provide('close:application-center', onClose)

function onOpen() {
    visible.value = true
}

function onClose() {
    visible.value = false
}
</script>

<style lang="less" scoped>
.system-bar {
    background-color: rgba(255, 255, 255, 0.1);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;

    .menu {
        .icon {
            height: 25px;
            width: 25px;
            margin: 0 15px;
            fill: rgba(255, 255, 255, 0.9);

            &:hover {
                fill: rgba(255, 255, 255, 0.7);
            }

            &:active {
                fill: rgba(255, 255, 255, 0.5);
            }
        }
    }

    .taskbar-container {
        flex: 1;
        position: relative;
        height: 100%;
    }
}

.application-center-wrapper {
    z-index: 100;
}
</style>

<style lang="stylus">
.application-center-fade-enter-active,
.application-center-fade-leave-active {
  transition: all 0.3s ease;
}

.application-center-fade-enter-from,
.application-center-fade-leave-to {
  opacity: 0;
  transform: scale3d(0.8,0.8,0) translate3d(0, 0, 0);
}
</style>
