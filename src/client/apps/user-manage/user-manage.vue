<template lang="pug">
page-container(full)
    data-form(:data-model='dataModel' @submit='onSubmit')
        a-form-item(label='text1' name='text1')
            a-input(v-model:value='dataModel.text1')
        a-form-item(label='text2' name='text2')
            a-input(v-model:value='dataModel.text2')
        a-form-item(label='text3' name='text3')
            a-input(v-model:value='dataModel.text3')
        a-form-item(label='test-date-1')
            a-date-picker
        a-form-item(label='test-select-1')
            a-select(mode='multiple' :default-value='["a1", "b2"]')
                template(#removeIcon) ✖
                template(#menuItemSelectedIcon) ✔
                a-select-option(
                    v-for='i in 25'
                    :key='(i + 9).toString(36) + i'
                ) {{ (i + 9).toString(36) + i }}
        template(#collapse)
            a-form-item(label='text4' name='text4')
                a-input(v-model:value='dataModel.text4')

    data-table(:data-source='dataSource' rowKey='age' :page='page')
        a-table-column(key='age' title='age' data-index='age')

    label-container
        label-item(label='123' value='123')
    a-button(@click='onOpenModal') modal
</template>

<script setup lang="ts">
import { PageService } from '@/bootstrap/http/page.service'
import { convertToTree } from '@/shared/utils/common.util'
import { onMounted, reactive, ref } from 'vue'
import ModalTest from './modal-test.vue'
import { useModal } from '@gopowerteam/vue-modal'
const modal = useModal()
const dataModel = reactive({
    text1: '1',
    text2: '2',
    text3: '3',
    text4: '4'
})

const page = new PageService()

const dataSource = [
    {
        age: 123
    },
    {
        age: 333
    }
]
const data1 = [
    {
        id: 1,
        a: 1
    },

    {
        id: 2,
        a: 2
    },
    {
        parentId: 1,
        id: 3,
        a: 3
    },

    {
        parentId: 1,
        id: 4,
        a: 4
    },
    {
        parentId: 2,
        id: 5,
        a: 5
    }
]

function onSubmit(data) {
    console.log(convertToTree(data1, { key: 'id', parentKey: 'parentId' }))
}

function onOpenModal() {
    console.log(modal)
    // modal.open({
    //     component: ModalTest
    // })
}

onMounted(() => {})

// #region Variable

// #endregion

// #region Function

// #endregion

// #region Event

// #endregion

// #region Lifecycle

// #endregion
</script>
