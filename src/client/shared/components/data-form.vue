<script lang="tsx">
import { defineComponent, ref, toRaw } from 'vue'
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue'
import { Form } from 'ant-design-vue'

export default defineComponent({
    components: {
        UpOutlined,
        DownOutlined,
        VNodes: {
            functional: true,
            render: ctx => ctx.$attrs.vnodes
        }
    },
    props: {
        dataModel: {
            type: Object,
            required: true
        },
        rules: {
            type: Array,
            default: () => []
        },
        column: {
            type: Number,
            default: () => 4
        },
        page: {
            type: Object,
            default: () => null
        }
    },
    emits: ['submit'],
    setup(props, ctx) {
        let form: any = ref()

        const { resetFields, validate, validateInfos } = Form.use(
            props.dataModel,
            props.rules
        )
        // 折叠状态
        let collapsed = ref(true)

        let wrapperCol = ref({
            span: 16,
            offset: 2
        })

        let labelCol = ref({
            span: 6
        })

        // 显示隐藏折叠项
        const onToggle = () => {
            collapsed.value = !collapsed.value
        }

        // 提交操作
        const onSubmit = (event?: MouseEvent) => {
            props.page && props.page.reset()
            event?.preventDefault()
            event?.stopPropagation()
            return validate()
                .then(() => {
                    ctx.emit('submit', toRaw(props.dataModel))
                })
                .catch(err => {
                    console.error(err)
                })
        }
        // 重置操作
        const onReset = () => {
            resetFields()
        }

        const onKeyDown = event => {
            if (event?.key === 'Enter') {
                onSubmit()
            }
        }

        return {
            form,
            collapsed,
            wrapperCol,
            labelCol,
            onSubmit,
            onToggle,
            onReset,
            onKeyDown
        }
    },
    render(props) {
        // 获取默认显示项
        const defaultFormItems = this.$slots.default
            ? (this.$slots.default() as any[])
            : []

        // 获取折叠显示项目
        const collapseFormItems = this.$slots.collapse
            ? (this.$slots.collapse() as any[])
            : []

        /**
         * 渲染默认显示项目
         */
        const renderDefaultFormItems = () => {
            return defaultFormItems.map((node: any, index) => (
                <a-col
                    class="form-item-wrapper"
                    span={(node.props && node.props.span) || 24 / props.column}
                    key={`default-${index}`}
                >
                    <v-nodes vnodes={node} />
                </a-col>
            ))
        }

        /**
         * 渲染折叠显示项目
         */
        const renderCollapseFormItems = () => {
            return collapseFormItems.map((node: any, index) => (
                <a-col
                    style={{ display: this.collapsed ? 'none' : 'block' }}
                    span={(node.props && node.props.span) || 24 / props.column}
                    key={`collapse-${index}`}
                >
                    <v-nodes vnodes={node} />
                </a-col>
            ))
        }

        /**
         * 渲染侧边栏
         */
        const renderFormSide = () => {
            return (
                <div class="form-side">
                    {this.$slots.collapse && (
                        <a onClick={this.onToggle}>
                            {this.collapsed ? <DownOutlined /> : <UpOutlined />}
                        </a>
                    )}
                </div>
            )
        }

        /**
         * 渲染操作项
         */
        const renderFormAction = () => {
            const actionItems = this.$slots.action
                ? (this.$slots.action() as any[])
                : []

            return (
                <div class="flex flex-row justify-between mt-5">
                    <div class="form-action">{actionItems}</div>
                    <div class="form-button">
                        <a-button type="primary" onClick={this.onSubmit}>
                            搜索
                        </a-button>
                        <a-button onClick={this.onReset}>重置</a-button>
                    </div>
                </div>
            )
        }

        return (
            <section class="data-form component" onKeydown={this.onKeyDown}>
                <data-card>
                    <a-form
                        model={this.dataModel}
                        ref="form"
                        layout="inline"
                        label-col={this.labelCol}
                        wrapper-col={this.wrapperCol}
                    >
                        <div class="flex flex-row w-full">
                            <a-row gutter={24} class="flex-auto">
                                {renderDefaultFormItems()}
                                {renderCollapseFormItems()}
                            </a-row>
                            {renderFormSide()}
                        </div>
                    </a-form>
                    {renderFormAction()}
                </data-card>
            </section>
        )
    }
})
</script>

<style lang="stylus">
// TODO: 添加样式穿透与SCOPED支持
.data-form.component
    .form-item-wrapper
        max-height 64px

    .form-side
        flex 0 1 180px
        text-align center
        padding-top 5px
        font-size 18px

    & .ant-form-item
        width 100%
        margin-right 24px
        margin-bottom 24px

    & .form-button,
    & .form-action
        & > *
            min-width 100px
            margin-right 15px
</style>
