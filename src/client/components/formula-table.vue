<template lang="pug">
.formula-table
    data-card
        template(#action v-if='editable')
            a-button(v-if='isCanEditPercent' type='link' @click='onAddRange') 添加区间
        .slider-container.py-10.mx-5(v-show='false')
            .slider-bar.rounded-lg.w-full.flex.flex-row.relative.items-center(
                ref='sliderBar'
            )
                .slider-item(
                    v-for='(range, index) in ranges'
                    :key='range'
                    :style='sliderItemStyle(range, index)'
                )
                .mark-item.absolute(
                    v-for='(mark, index) in marks'
                    :key='mark'
                    :style=`{
                        left: (mark / max) * 100 + '%',
                        zIndex: 100 - index
                    }`
                )
                    .mark-icon.rounded.cursor-pointer(
                        @mousedown.prevent='onDragStart($event, index)'
                    )
                    .mark-title {{ mark }}
        .table-container
            table.w-full
                tr
                    th.p-2.text-center.text-lg.font-bold {{ rangeTitle }}
                    th.p-2.text-center.text-lg.font-bold {{ valueTitle }}
                    th.p-2.text-center.text-lg.font-bold(v-if='editable') 操作
                tr(v-for='(range, index) in ranges' :key='index')
                    td.p-2
                        .flex.flex-row.justify-center.items-center
                            a-input-group.text-right(compact)
                                a-select(
                                    style='width: 100px'
                                    :disabled='index === 0 || !editable'
                                    v-model:value='includes[index].min'
                                    @select='onMinChange($event, index)'
                                )
                                    a-select-option(:value='0') 大于
                                    a-select-option(:value='1') 大于等于
                                a-input-number(
                                    v-if='index === 0 && !isCustom'
                                    v-model:value='range.min'
                                    disabled
                                    :style='{ width: "120px" }'
                                )
                                a-input-number(
                                    v-else-if='index !== 0 && !isCustom'
                                    :disabled='!editable'
                                    v-model:value='marks[index - 1]'
                                    :style='{ width: "120px" }'
                                )
                            .flex(v-if='isCustom' :style='{ width: "55px" }') X{{ index + 1 }}
                            .label.px-5 -
                            a-input-group(compact)
                                .flex.flex-row
                                    a-select(
                                        style='width: 100px'
                                        :disabled='index === ranges.length - 1 || !editable'
                                        v-model:value='includes[index].max'
                                        @select='onMaxChange($event, index)'
                                    )
                                        a-select-option(:value='0') 小于
                                        a-select-option(:value='1') 小于等于
                                    a-input-number(
                                        v-if='index === ranges.length - 1 && !isCustom'
                                        disabled
                                        v-model:value='range.max'
                                        :style='{ width: "120px" }'
                                        :formatter='value => `+∞`'
                                        :parser='value => value.replace("+∞", max)'
                                    )
                                    a-input-number(
                                        v-else-if='index !== ranges.length - 1 && !isCustom'
                                        :disabled='!editable'
                                        v-model:value='marks[index]'
                                        :style='{ width: "120px" }'
                                    )
                            .flex(v-if='isCustom' :style='{ width: "55px" }') X{{ index + 2 }}
                    td.p-2
                        .flex.flex-row.justify-center
                            a-input-number(
                                :min='0'
                                :max='100'
                                :disabled='!editable || !isCanEditPercent'
                                v-model:value='values[index]'
                                :precision='precision'
                                :style='{ width: "120px" }'
                                :formatter='value => `${value}%`'
                                :parser='value => value.replace("%", "")'
                            )
                    td.p-2(v-if='editable')
                        .flex.flex-row.justify-center
                            a-button(
                                :disabled='index === 0 || !isCanDelete'
                                type='link'
                                @click='onRemoveMark(index)'
                            ) 删除
</template>
<script lang="ts">
import { computed, defineComponent, defineProps, onMounted, ref } from 'vue'

export default defineComponent({
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100000
        },
        rangeTitle: {
            type: String,
            default: '区间范围'
        },
        valueTitle: {
            type: String,
            default: '区间比例'
        },
        precision: {
            type: Number,
            default: 2
        },
        isCanDelete: {
            type: Boolean,
            default: true
        },
        editable: {
            type: Boolean,
            default: false
        },
        isCanEditPercent: {
            type: Boolean,
            default: true
        },
        isCustom: {
            type: Boolean,
            default: false
        },
        dataSource: {
            type: Array
        }
    },
    setup(props) {
        // #region Variable
        // 当前移动的mark位置
        let position = 0
        // 当前拖动的mark
        let currentIndex = 0

        const sliderBar = ref()
        const includes = ref<any[]>([{ min: 0, max: 0 }])

        const marks = ref<number[]>([])
        const values = ref<any[]>([])

        const ranges = computed((): any[] => {
            // for (let index = 0; index < marks.value.length; index++) {
            //     if(index !== 0){
            //         if (marks.value[index - 1] >= marks.value[index]) {
            //             marks.value[index] = marks.value[index - 1] + 1
            //         }
            //     }
            // }
            // console.log(marks.value)
            const items = [0, ...marks.value, props.max]
            return items.reduce((result, value, index) => {
                if (index === 0) return result
                if (index === 1) {
                    result.push({
                        min: 0,
                        max: value
                    })
                } else {
                    result.push({
                        min: items[index - 1],
                        max: value
                    })
                }
                return result
            }, new Array<any>())
        })
        // #endregion

        // #region Function

        /**
         * 添加范围
         */
        function onAddRange() {
            includes.value.push({
                min:
                    includes.value[includes.value.length - 1].max === 0 ? 1 : 0,
                max: 0
            })
            marks.value.push(props.max)
            values.value.push(0)
        }

        function onMinChange(value, index) {
            if (index === 0) return

            includes.value[index - 1].max = value === 0 ? 1 : 0
        }

        function onMaxChange(value, index) {
            if (index === includes.value.length - 1) return

            includes.value[index + 1].min = value === 0 ? 1 : 0
        }

        /**
         * 拖动处理
         */
        function onDragMove(e) {
            const x = position - e.clientX
            const width = sliderBar.value.clientWidth
            position = e.clientX
            const value = Math.floor(
                marks.value[currentIndex] - (x / width) * props.max
            )

            if (value <= 0 || value < marks.value[currentIndex - 1]) {
                marks.value[currentIndex] =
                    currentIndex === 0 ? 0 : marks.value[currentIndex - 1]
                return
            }

            if (value >= props.max || value > marks.value[currentIndex + 1]) {
                marks.value[currentIndex] =
                    currentIndex === marks.value.length - 1
                        ? props.max
                        : marks.value[currentIndex + 1]
                return
            }

            marks.value[currentIndex] = value
        }

        /**
         * 结束拖动处理
         */
        function onDragEnd() {
            // 更新位置
            position = 0
            document.removeEventListener('mouseup', onDragEnd)
            document.removeEventListener('mousemove', onDragMove)
        }

        /**
         * 开始拖动处理
         */
        function onDragStart(e, index) {
            if (!props.editable) return

            position = e.clientX
            currentIndex = index

            document.addEventListener('mouseup', onDragEnd)
            document.addEventListener('mousemove', onDragMove)
        }

        /**
         * sliderItem样式
         */
        function sliderItemStyle(range, index) {
            return {
                width: ((range.max - range.min) / props.max) * 100 + '%',
                'background-color': `rgb(${(100 + 25 * index) % 255},${
                    (150 - 50 * index) % 255
                },${(200 + 75 * index) % 255})`
            }
        }

        /**
         * 获取数据源
         */
        function getDataSource() {
            const data = ranges.value.map((x, index) => ({
                min: x.min * Math.pow(10, props.precision),
                max: x.max * Math.pow(10, props.precision),
                minFlag: includes.value[index].min,
                maxFlag: includes.value[index].max,
                value: values.value[index] * Math.pow(10, props.precision)
            }))

            delete data[data.length - 1].max

            return Promise.resolve(data)
        }

        /**
         * 设置数据源
         */
        function setDataSource(data: any[]) {
            marks.value = data.reduce((result, value, index) => {
                if (index > 0 && index < data.length)
                    result.push(value.min / Math.pow(10, props.precision))

                return result
            }, [])

            includes.value = data.map(x => ({
                min: x.minFlag || 0,
                max: x.maxFlag || 0
            }))

            values.value = data.map(
                x => x.value / Math.pow(10, props.precision)
            )
        }

        /**
         * 删除mark
         */
        function onRemoveMark(index) {
            marks.value.splice(index - 1, 1)
            includes.value.splice(index, 1)

            if (includes.value.length === 1) includes.value[0].max = 0
            else
                includes.value[index - 1].max =
                    includes.value[index].min === 0 ? 1 : 0
        }

        onMounted(() => {
            if (props.dataSource) {
                setDataSource(props.dataSource)
            }
        })

        return {
            marks,
            ranges,
            values,
            sliderBar,
            includes,
            onRemoveMark,
            onAddRange,
            onDragStart,
            onMinChange,
            onMaxChange,
            sliderItemStyle,
            getDataSource,
            setDataSource
        }
    }
})
</script>
<style lang="stylus" scoped>
.formula-table

    .slider-container
        .slider-bar
            height 30px
            .slider-item
                // background red
                height 10px
            .mark-item
                height 30px
                .mark-icon
                    z-index 10
                    height 30px
                    width 10px
                    background #3e3e3e
                .mark-title
                    position absolute
                    color red
                    top -25px
                    width   100px
                    margin-left -50px
                    text-align center

    .table-container
        table,td,tr
            border solid 1px rgba(0,0,0,0.3)
            border-collapse collapse
</style>
