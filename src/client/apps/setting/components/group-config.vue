<template lang="pug">
.group-config.flex.flex-row.absolute
    column-container 
        column-item(width='250px')
            data-card.group-list(overflow)
                template(#action)
                    a-button(type='link' @click='onAddGroup') 添加分组
                .group-item.flex.items-center.cursor-pointer.space-x-2.py-5.px-2(
                    v-for='group in groups'
                    :class='{ active: group === currentGroup }'
                    @click='onChangeGroup(group)'
                )
                    .group-name {{ group.name }}
        column-item(:flex='1')
            data-card.flex-auto(overflow)
                template(v-if='currentGroup' #footer)
                    a-button(type='primary' @click='onUpdateGroup') 更新
                    a-button(@click='onDeleteGroup') 移除
                .group-data(v-if='currentGroup')
                    a-form
                        a-form-item(label='应用名称')
                            a-input(v-model:value='model.name')
                        a-form-item(label='分组应用')
                            .flex.flex-row(v-if='currentGroup?.apps?.length')
                                .app.px-5.pb-5.flex.flex-col.items-center(
                                    v-for='app in currentGroup.apps'
                                    :key='app.name'
                                )
                                    .icon.w-10
                                        img(:src='app.icon')
                                    .title {{ app.title }}
                            .flex(v-else) 暂无应用
                a-empty.mt-40(v-else)
</template>

<script setup lang="ts">
import { useRequest } from '@/graphql'
import { applicationRequest } from '@/graphql/application.graph'
import { IStore } from '@/store'
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore(IStore)

const request = useRequest()

const currentGroup = ref()
const groups = ref<any[]>([])
const apps = ref<any[]>([])
const model = ref<any>({})
/**
 * 添加分组
 */
function onAddGroup() {
    request(applicationRequest.addGroup, {
        group: {
            name: '新分组',
            order: groups.value.length
        }
    }).then(data => {
        getGroupList()
    })
}

function onChangeGroup(group) {
    currentGroup.value = {
        ...group,
        apps: apps.value.filter(app => app?.group?._id === group?._id)
    }

    model.value = {
        _id: group._id,
        name: group.name,
        sort: group.sort
    }
}

function getGroupList() {
    request(applicationRequest.getGroupList).then(({ GetGroupList: data }) => {
        groups.value = data
    })
}

function getAppList() {
    request(applicationRequest.getAppList).then(({ GetAppList: data }) => {
        apps.value = data
    })
}

function onUpdateGroup() {
    request(applicationRequest.updateGroup, {
        group: model.value
    }).then(data => {
        getGroupList()
    })
}

function onDeleteGroup() {
    request(applicationRequest.deleteGroup, {
        id: model.value._id
    }).then(data => {
        currentGroup.value = null
        getGroupList()
        message.success('删除成功')
    })
}

onMounted(() => {
    getGroupList()
    getAppList()
})
</script>

<style lang="stylus" scoped>
.group-config
    top 50px
    bottom 0
    left 0
    right 0
.group-list
    flex-basis 250px
    .group-item
        &.active
            background-color rgba(0,200,0,0.1)
            color lightgreen
        &:hover
            background-color rgba(0,0,0,0.1)
.group-data
    min-height 100%
    .app
        .title
            font-size 8px
</style>
