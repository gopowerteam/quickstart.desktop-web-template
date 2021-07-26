<template lang="pug">
.application-config.absolute.inset-x-0.bottom-0.top-12
    column-container.w-full
        column-item(width='250px')
            data-card.application-list(overflow)
                a-collapse(size='mimi')
                    a-collapse-panel(key='master' header='集团岗位')
                        .role-item(
                            v-for='role in masterRoles'
                            :key='role.id'
                            :class='{ active: currentRole && currentRole.id === role.id }'
                            @click='onChangeCurrentRole(role)'
                        ) {{ role.name }}
                    a-collapse-panel(key='branch' header='分院岗位')
                        .role-item(
                            v-for='role in branchRoles'
                            :key='role.id'
                            :class='{ active: currentRole && currentRole.id === role.id }'
                            @click='onChangeCurrentRole(role)'
                        ) {{ role.name }}

        column-item(:flex='1')
            data-card(overflow)
                template(#action)
                    a-button(type='primary' @click='onUpdateRole') 更新
                label-container(:column='1' v-if='currentRole')
                    label-item(label='岗位名称' :value='currentRole.name')
                    label-item(label='岗位权限')
                        a-checkbox-group(v-model:value='currentApps')
                            .flex.flex-wrap
                                .app-item.w-60.py-1(
                                    v-for='app in apps'
                                    :key='app.name'
                                )
                                    a-checkbox(:value='app.name') {{ app.title }}
</template>

<script setup lang="ts">
import { useRequest } from '@/graphql'
import { applicationRequest } from '@/graphql/application.graph'
import { IStore } from '@/store'
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore(IStore)
const request = useRequest()

ref: masterRoles = [] as any[]
ref: branchRoles = [] as any[]
ref: currentRole = null as any
ref: currentApps = [] as string[]
ref: apps = [] as any[]

const getRoleList = () => {
    masterRoles = store.state.dict.groupRoles
    branchRoles = store.state.dict.branchRoles
    apps = store.state.app.applications
}

function getCurrentRole(id) {
    request(applicationRequest.getRoleById, { roleid: id }).then(
        ({ GetRoleById: data }) => {
            if (data && data.apps) currentApps = data.apps || []
            else currentApps = []
        }
    )
}

function onUpdateRole() {
    request(applicationRequest.updateRole, {
        roleid: currentRole.id,
        apps: currentApps
    }).then(data => {
        console.log(data)
    })
}

function onChangeCurrentRole(value) {
    currentRole = value
    getCurrentRole(currentRole.id)
}

onMounted(() => {
    getRoleList()
})
</script>

<style lang="stylus" scoped>
.role-item
    padding 10px
    &:hover
        background-color rgba(0,0,0,0.1)
        cursor pointer
    &.active
        color $primary-color
</style>
