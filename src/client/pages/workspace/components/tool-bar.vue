<template lang="pug">
.tool-bar.flex.align-center.space-x-5
    UserOutlined.text-xl(
        class='hover:text-white'
        @click='store.commit("app/updateDrawerVisable", true)'
    )
    FullscreenOutlined.text-xl(
        class='hover:text-white'
        @click='updateFullscreen'
        v-if='!fullscreenElelment'
    )
    FullscreenExitOutlined.text-xl(
        class='hover:text-white'
        @click='updateFullscreen'
        v-else
    )
</template>

<script setup lang="ts">
import {
    UserOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined
} from '@ant-design/icons-vue'
import { useStore } from 'vuex'

import { IStore } from '@/store'
import { onMounted } from '@vue/runtime-core'
import { ref } from 'vue'

const store = useStore(IStore)
const fullscreenElelment = ref()

const updateFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        }
    }
}

onMounted(() => {
    document.addEventListener('fullscreenchange', (...a) => {
        fullscreenElelment.value = document.fullscreenElement
    })
})
</script>

<style lang="stylus" scoped>
.tool-bar
  // height:100%
  // padding:0 10px
  margin:0 20px
  // background:red
</style>
