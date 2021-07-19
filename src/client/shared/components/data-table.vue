<template lang="pug">
.data-table
    .flex.flex-row.justify-between.pb-10(v-if='$slots.action || $slots.extra')
        .table-action.flex.flex-row.items-center.space-x-2
            slot(name='action')
        .table-extra.flex.flex-row.items-center.space-x-2
            slot(name='extra')
    .table-wrapper
        a-table(
            size='small'
            :data-source='dataSource'
            :rowKey='rowKey'
            :pagination='false'
            align='center'
        )
            slot
    .pagination-wrapper.text-right(v-if='page')
        a-pagination.py-5(
            v-model:current='page.pageIndex.value'
            v-model:page-size='page.pageSize.value'
            :page-size-options='page.pageSizeOpts'
            :total='page.total'
            showSizeChanger
            @change='emit("pageChange", page)'
            @showSizeChange='emit("pageChange", page)'
        )
</template>
<script setup lang="ts">
const props = defineProps({
    dataSource: {
        type: Object,
        required: true
    },
    page: {
        type: Object,
        default: null
    },
    rowKey: {
        type: String,
        required: true
    }
})

const emit = defineEmits({
    pageChange: e => e
})
</script>
<style lang="stylus"></style>
