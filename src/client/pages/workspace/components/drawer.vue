<template lang="pug">
a-drawer(placement='right' v-model:visible='store.state.app.drawerVisible')
    .content.flex.flex-col.absolute.inset-0
        .top-content.text-center.pt-10
            a-avatar(:size='72') {{ store.state.user.current?.username }}
            .welcome.mt-2 您好,{{ store.state.user.current?.username }}
        .middle-content.flex-auto.overflow
            .header 最新通知(0)
            a-empty.mt-36
        .bottom-content
            .grid.grid-cols-2.gap-4.p-3
                .action-item(
                    v-for='action in actions'
                    :key='action.text'
                    @click='onAction(action.handle)'
                )
                    .icon.p-1 
                        component(:is='action.icon')
                    .text {{ action.text }}
</template>

<script setup lang="ts">
import { IStore } from '@/store'
import { useStore } from 'vuex'
import { ExportOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { appConfig } from '@/config/app.config'
const store = useStore(IStore)
const router = useRouter()

const actions = ref<
    {
        icon: any
        text: string
        handle: Function
        filter?: () => Boolean
    }[]
>(
    [
        {
            icon: SettingOutlined,
            text: '系统设置',
            handle: onSetting,
            filter: () => store.getters['user/isAdmin']
        },
        {
            icon: ExportOutlined,
            text: '退出登录',
            handle: onLogout
        }
    ].filter(x => !x.filter || x.filter())
)

function onLogout() {
    store.commit('user/logout')
    router.push('/login')
}

function onSetting() {
    store.commit('app/openApp', 'setting')
}

function onAction(handle) {
    store.commit('app/updateDrawerVisable', false)
    handle && handle()
}
</script>

<style lang="stylus" scoped>
.middle-content
    .header
        margin-top 15px
        padding 5px
        color rgba(0,0,0,0.7)
        border solid 1px rgba(0,0,0,0.2)
.action-item
    cursor pointer
    &:hover
        background-color #efefef
    .icon
        text-align center
        font-size 24px
        color rgba(0,0,0,0.6)
    .text
        text-align center
        font-size 14px
        color rgba(0,0,0,0.6)
</style>
