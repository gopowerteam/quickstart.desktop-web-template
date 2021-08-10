<template lang="pug">
.application-config.absolute.inset-x-0.bottom-0.top-12
    data-card.application-list(overflow)
        template(#action)
            a-button(
                type='link'
                @click.prevent.stop='groupModal.visible = true'
            ) 添加分组
        a-collapse
            a-collapse-panel(header='未分组')
                template(#extra)
                    .icon.px-3.py-1
                        SettingOutlined(@clock='onChangeGroup()')
                .flex
                    .application-item.flex.flex-col.items-center.cursor-pointer.rounded.py-5.px-5(
                        v-for='app in apps.filter(app => !app.group)'
                        :class='{ active: app === currentApp }'
                        @click='onChangeApp(app)'
                    )
                        .app-image
                            img.w-10(:src='app.icon')
                        .app-name.text-xs.pt-3 {{ app.title }}
            a-collapse-panel(
                v-for='group in groups'
                :header='group.label'
                :key='group.value'
            )

    a-drawer(
        :visible='!!currentApp'
        @close='() => (currentApp = null)'
        placement='bottom'
        destroyOnClose
        title='应用配置'
        :height='400'
    )
        data-card
            template(#footer)
                a-button(type='primary' @click='onUpdateApp') 更新应用
            a-form(v-if='appModel')
                a-form-item(label='应用名称')
                    a-input(v-model:value='appModel.title')
                a-form-item(label='应用图标')
                    upload(@upload='onUpload')
                        img.w-16(:src='appModel.icon')
                a-form-item(label='应用分组')
                    a-select(v-model:value='appModel.group' :options='groups')
    a-drawer(
        :visible='!!currentGroup'
        @close='() => (currentGroup = null)'
        placement='bottom'
    )
        data-card
            template(#footer)
                a-button(type='primary' @click='onUpdateApp') 删除分组
                a-button(type='primary' @click='onUpdateApp') 更新分组
            a-form(v-if='groupModel')
                a-form-item(label='分组名称')
                    a-input(v-model:value='groupModel.name')
    a-modal(title='创建分组' v-model:visible='groupModal.visible' @ok='onAddGroup')
        a-form
            a-form-item(label='分组名称')
                a-input(v-model:value='groupModal.name')
</template>

<script setup lang="tsx">
import { onMounted, ref, h } from 'vue'
import { ApplicationList } from '@/config/application.config'
import { Input, message } from 'ant-design-vue'
import { useGraphql } from '@/graphql'
import { SettingOutlined } from '@ant-design/icons-vue'
import { useModal } from '@gopowerteam/vue-modal'

const modal = useModal()

ref: currentApp = ref<any>()
ref: currentGroup = ref<any>()
ref: apps = ref<any[]>([])
ref: groups = ref<any[]>([])

ref: groupModal = ref({
    visible: false,
    name: ''
})

ref: appModel = ref<{
    name: string
    title: string
    icon: string
    group: string
}>()

ref: groupModel = ref<{
    name: string
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
            console.log(data)
        })
}

function onAddGroup() {
    if (groupModal.name) {
        graphql
            .mutation({
                createGroup: [
                    {
                        name: groupModal.name
                    },
                    { id: true, name: true }
                ]
            })
            .then(data => {
                getGroupList()
            })
    }
}

function onChangeGroup() {}

function onChangeApp(app) {
    appModel = {
        name: app.name,
        title: app.title,
        icon: app.icon,
        group: app.group ? app.group._id : ''
    }

    currentApp = app
}

function getGroupList() {
    graphql
        .query({
            getGroupList: {
                id: true,
                name: true
            }
        })
        .then(({ getGroupList: data }) => {
            groups = data.map(x => ({
                label: x.name,
                value: x.id
            }))
        })
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
    //     app: appModel.value
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
            color $primary-color
        &:hover
            background-color rgba(0,0,0,0.1)
</style>
