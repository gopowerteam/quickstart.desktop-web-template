<template lang="pug">
page-container
    a-tabs.absolute.inset-0(v-model:activeKey='currentPane')
        a-tab-pane(key='application' tab='应用管理')
            application-config(v-if='currentPane === "application"')
        //- a-tab-pane(key='group' tab='分组管理')
        //-     group-config(v-if='currentPane === "group"')
        //- a-tab-pane(key='role' tab='权限管理')
        //-     role-config(v-if='currentPane === "role"')
</template>

<script setup lang="ts">
import ApplicationConfig from '../components/application-config.vue'
import GroupConfig from '../components/group-config.vue'
// import RoleConfig from '../components/role-config.vue'

ref: currentPane = 'application'
</script>

<style lang="stylus" scoped></style>
