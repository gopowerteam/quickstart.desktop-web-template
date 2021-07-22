<template lang="pug">
.application-config.absolute.inset-x-0.bottom-0.top-12
    column-container.w-full
        column-item(width='250px')
            data-card.application-list(overflow)
                .application-item.flex.items-center.cursor-pointer.space-x-2.py-5.px-2(
                    v-for='app in apps'
                    :class='{ active: app === currentApp }'
                    @click='onChangeApp(app)'
                )
                    .app-image
                        img.w-10(:src='app.icon')
                    .app-name.text-xs {{ app.title }}
        column-item(:flex='1')
            data-card(overflow)
                .application-data(v-if='model')
                    a-form
                        a-form-item(label='应用名称')
                            a-input(v-model:value='model.title')
                        a-form-item(label='应用图标')
                            upload(@upload='onUpload')
                                img.w-16(:src='model.icon')
                        a-form-item(label='应用分组')
                            a-select(
                                v-model:value='model.group'
                                :options='groups'
                            )

                a-empty.mt-40(v-else)
                template(#footer v-if='currentApp')
                    a-button(type='primary' @click='onUpdateApp') 更新
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ApplicationList } from '@/config/application.config'
import { message } from 'ant-design-vue'
import { useGraphql } from '@/graphql'

ref: apps = ref<any[]>([])
ref: currentApp = ref<any>()
ref: groups = ref<any[]>([])
ref: model = ref<{
    name: string
    title: string
    icon: string
    group: string
}>()

const graphql = useGraphql()

function onUpload(file) {
    //- cosUtil.pubObject(file).then(({ Location }) => {
    //-     const url = `https://${Location}`
    //-     if (model.value) {
    //-         model.value.icon = url
    //-     }
    //- })
}

function getAppList() {
    graphql
        .query({
            getAppList: {
                name: true,
                title: true,
                icon: true,
                maximize: true,
                group: {
                    id: true,
                    name: true
                }
            }
        })
        .then(({ getAppList: data }) => {
            apps = data
        })
    // request(applicationRequest.getAppList).then(({ GetAppList: data }) => {
    //     apps.value = data
    // })
}

function onChangeApp(app) {
    currentApp = app
    model = {
        name: app.name,
        title: app.title,
        icon: app.icon,
        group: app.group ? app.group._id : ''
    }
    getGroupList()
}

function getGroupList() {
    // request(applicationRequest.getGroupList).then(({ GetGroupList: data }) => {
    //     const list = data.map(x => ({
    //         key: x._id,
    //         label: x.name,
    //         value: x._id
    //     }))
    //     groups.value = [
    //         {
    //             key: '',
    //             label: '无分组',
    //             value: ''
    //         },
    //         ...list
    //     ]
    // })
}

function onUpdateApp() {
    // request(applicationRequest.updateApp, {
    //     app: model.value
    // }).then(data => {
    //     getAppList()
    //     message.success('更新成功')
    // })
}

onMounted(() => {
    getAppList()
    getGroupList()
})
</script>

<style lang="stylus" scoped>
.application-config
    top 50px
    bottom 0
    left 0
    right 0
.application-list
    .application-item
        &.active
            background-color rgba(0,200,0,0.1)
            color lightgreen
        &:hover
            background-color rgba(0,0,0,0.1)
</style>
