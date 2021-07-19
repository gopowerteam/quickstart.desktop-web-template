<template lang="pug">
page-container(full title='用户选择')
    template(#action)
        a-button(
            :disabled='!model.users.length'
            type='primary'
            @click='onSubmit'
        ) 提交
    .flex.flex-row.space-x-5.absolute.inset-0
        data-card.h-full.flex-auto(title='待选')
            a-tree-select(
                :style='{ minWidth: "100%" }'
                v-model:value='model.department'
                :tree-data='departments'
                :dropdown-style='{ maxHeight: "400px", minWidth: "200px", overflow: "auto" }'
                placeholder='请选择部门'
                :replaceFields=`{
                      title:'name',
                      key:'deptId',
                    }`
            )
            a-table.pt-5(
                size='small'
                :data-source='users'
                rowKey='userid'
                :pagination='false'
                :scroll='{ x: false, y: 500 }'
                align='center'
            )
                a-table-column(
                    key='name'
                    title='姓名'
                    data-index='name'
                    align='center'
                )
                a-table-column(
                    key='title'
                    title='职称'
                    data-index='title'
                    align='center'
                )
                a-table-column(title='操作' align='center')
                    template(v-slot='{ record }')
                        a-button(
                            type='link'
                            :disabled='model.users.map(x => x.userid).includes(record.userid) || getSingle()'
                        ) 添加
        data-card.h-full.flex-auto(title='已选')
            label-container
                label-item(label='选择人数') {{ model.users.length }}
            a-table(
                size='small'
                :data-source='model.users'
                rowKey='userid'
                :pagination='false'
                :scroll='{ x: false, y: 300 }'
            )
                a-table-column(
                    key='name'
                    title='姓名'
                    data-index='name'
                    align='center'
                )
                a-table-column(
                    key='title'
                    title='职称'
                    data-index='title'
                    align='center'
                )
                a-table-column(title='操作' align='center')
                    template(v-slot='{ record }')
                        a-button(type='link') 删除
</template>

<script setup lang="ts">
import { inject, onMounted, reactive, ref } from 'vue'

import { useStore } from 'vuex'
import { IStore } from '@/store'
import { useRequest } from '@/graphql'
import { TreeSelect } from 'ant-design-vue'

const request = useRequest()
const store = useStore(IStore)
const navigate = inject('navigate') as any
const departments = ref<any[]>([])

const props = defineProps({
    isSingle: {
        type: Boolean,
        default: false
    },
    isFilter: {
        type: Boolean,
        default: true
    }
})

const users = ref([])

const model = reactive<{ department: string[]; users: any[] }>({
    department: [],
    users: []
})

function onSubmit() {
    navigate.back({ data: model.users })
}

onMounted(() => {})
</script>

<style lang="stylus" scoped>
.page-container
  background-size: 100% 100%;
  overflow: hidden;

  .form-container
    min-width:1200px;
    min-height:800px;
    border-radius:5px

    .department-select
      min-width 200px

    .login-button
      width:50px;
      height:50px;
</style>
