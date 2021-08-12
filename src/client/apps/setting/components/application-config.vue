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
                v-for='group in groups.filter(x => x.value)'
                :header='group.label'
                :key='group.value'
            )
                template(#extra)
                    .icon.px-3.py-1
                        SettingOutlined(@click.stop='onChangeGroup(group)')
                .flex
                    .application-item.flex.flex-col.items-center.cursor-pointer.rounded.py-5.px-5(
                        v-for='app in apps.filter(app => app.group && app.group.id === group.value)'
                        :class='{ active: app === currentApp }'
                        @click='onChangeApp(app)'
                    )
                        .app-image
                            img.w-10(:src='app.icon')
                        .app-name.text-xs.pt-3 {{ app.title }}

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
        title='分组配置'
        :height='250'
    )
        data-card
            template(#footer)
                a-popconfirm(
                    title='删除分组会将分组下应用归入未分组,确认删除?'
                    ok-text='确定'
                    cancel-text='取消'
                    @confirm='onDeleteGroup'
                )
                    a-button.ml-5(type='primary' danger) 删除分组
                a-button(type='primary' @click='onUpdateGroup') 更新分组
            a-form(v-if='groupModel')
                a-form-item(label='分组名称')
                    a-input(v-model:value='groupModel.title')
    a-modal(title='创建分组' v-model:visible='groupModal.visible' @ok='onAddGroup')
        a-form
            a-form-item(label='分组名称')
                a-input(v-model:value='groupModal.title')
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
    title: ''
})

ref: appModel = ref<{
    name: string
    title: string
    icon: string
    group?: number
}>()

ref: groupModel = ref<{
    id: number
    title: string
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
                    title: true
                }
            }
        })
        .then(({ getAppList: data }) => {
            apps = data
        })
}

function getGroupList() {
    graphql
        .query({
            getGroupList: {
                id: true,
                title: true
            }
        })
        .then(({ getGroupList: data }) => {
            groups = [
                {
                    label: '未分组',
                    value: null
                },
                ...data.map(x => ({
                    label: x.title,
                    value: x.id
                }))
            ]
        })
}

function onAddGroup() {
    if (groupModal.title) {
        graphql
            .mutation({
                createGroup: [
                    {
                        title: groupModal.title
                    },
                    { id: true, title: true }
                ]
            })
            .then(data => {
                getGroupList()
                groupModal.visible = false
            })
    }
}

function onChangeGroup(group) {
    groupModel = {
        id: group.value,
        title: group.label
    }

    currentGroup = {
        id: group.value,
        title: group.label
    }
}

function onChangeApp(app) {
    appModel = {
        name: app.name,
        title: app.title,
        icon: app.icon,
        group: app.group ? app.group.id : null
    }

    currentApp = app
}

function onUpdateApp() {
    if (!appModel) {
        return
    }

    graphql
        .mutation({
            updateApp: [
                {
                    app: appModel
                },
                {
                    result: true
                }
            ]
        })
        .then(() => {
            currentApp = null
            getAppList()
        })
}

function onUpdateGroup() {
    if (!groupModel) {
        return
    }

    graphql
        .mutation({
            updateGroup: [
                {
                    group: groupModel
                },
                {
                    result: true
                }
            ]
        })
        .then(() => {
            currentGroup = null
            getGroupList()
            getAppList()
        })
}

function onDeleteGroup() {
    if (!groupModel) {
        return
    }

    graphql
        .mutation({
            deleteGroup: [
                {
                    id: groupModel.id
                },
                {
                    result: true
                }
            ]
        })
        .then(() => {
            currentGroup = null
            getGroupList()
            getAppList()
        })
}

onMounted(() => {
    getGroupList()
    getAppList()
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
