<template lang="pug">
.application-container(
    @mousedown='onActiveApp'
    :class='{ minimize: app.minimize, dragging: app.dragging }'
    :style='style'
)
    .application-header-wrapper
        application-header
    .application-body-wrapper
        application-body
    application-border
</template>

<script setup lang="ts">
import {
    computed,
    inject,
    onMounted,
    provide,
    reactive,
    defineProps
} from 'vue'
import ApplicationHeader from './components/application-header.vue'
import ApplicationBody from './components/application-body.vue'
import ApplicationBorder from './components/application-border.vue'

import { useStore } from 'vuex'

// Store
import { IStore } from '@/store'

const store = useStore(IStore)
// Props
const props = defineProps({
    app: {
        type: Object,
        required: true
    }
})

const screenHeight = inject('screenHeight') as any
const screenWidth = inject('screenWidth') as any

// #region Variable
// 位置数据
const position = reactive<{
    top: number
    left: number
    width: number | string
    height: number | string
    minWidth: number
    minHeight: number
    index: number
    before: any
}>({
    top: 0,
    left: 0,
    width: 1400,
    height: 768,
    minWidth: 720,
    minHeight: 480,
    index: props.app.index,
    before: {}
})

// 屏幕尺寸
const parentSize = { width: 0, height: 0 }

// 应用路由
const routes: any[] = [
    {
        component: props.app.root,
        props: {}
    }
]

// 应用路由监听列表
const routerChangeListeners: any[] = []
// #endregion

//#region Function
// 计算默认位置
function getDefaultPosition() {
    position.left = (screenWidth.value - (position as any).width) / 2
    position.top = (screenHeight.value - (position as any).height) / 2

    if (position.top < 0) position.top = 0
}

// 激活窗口
function onActiveApp() {
    store.commit('app/activeApp', props.app.id)
}
//#endregion

// #region Position Logic

// 监听Index更新
store.commit('app/onAppIndexChange', {
    id: props.app.id,
    caller: index => {
        position.index = index
    }
})

// 监听窗口最大化状态变化
store.commit('app/onMaximizeChange', {
    id: props.app.id,
    caller: value => {
        if (value) {
            // 保存历史位置
            position.before = {
                top: position.top,
                left: position.left,
                width: position.width,
                height: position.height
            }

            position.width = '100%'
            position.height = '100%'
            position.left = 0
            position.top = 0

            store.commit('app/activeApp', props.app.id)
        } else {
            const before = position.before as any
            position.width = before.width
            position.height = before.height
            position.left = before.left
            position.top = before.top
        }
    }
})

// 生成样式
const style = computed(() => {
    const getStyleFormat = value =>
        typeof value === 'string' ? value : `${value}px`

    const target = {
        top: getStyleFormat(position.top),
        left: getStyleFormat(position.left),
        height: getStyleFormat(position.height),
        width: getStyleFormat(position.width),
        zIndex: props.app.index
    } as any

    if (props.app.minimize) {
        setTimeout(() => {
            target.display = 'none'
        }, 300)
    }

    return target
})

// #endregion

// #region Resize Logic
const resizeStyle = {}

// #endregion

// #region Launch
const navigate = {
    async push({ component, props, onBack }) {
        const route = { component, props }
        routes.push(route)
        routerChangeListeners.forEach((listener: any) =>
            listener('push', route)
        )
        if (onBack) {
            routerChangeListeners.push((type, data, route) => {
                if (type === 'pop' && route.component === component) {
                    onBack(data)
                }
            })
        }
    },
    async back({ data, callback }: { data?: any; callback: Function } = {}) {
        if (routes.length === 1) return
        if (callback && (await callback()) === false) return

        const route = routes.pop()
        routerChangeListeners.forEach(
            (listener: any) => listener && listener('pop', data, route)
        )
    },
    routes: routes
}

// 位置数据
provide('position', position)
// 应用数据
provide('app', props.app)
// 应用路由监听注册函数
provide('onRouterChange', caller => {
    routerChangeListeners.push(caller)
})

// 导航操作
provide('navigate', navigate)

onMounted(() => {
    // 获取默认位置
    getDefaultPosition()
})
// #endregion
</script>

<style lang="stylus" scoped>
@keyframes active {
    0% {
        transform scale(0)
        opacity 0
    }
    100% {
        transform scale(1)
        opacity 1
    }
}



.application-container
  position: absolute
  display: flex
  flex-direction: column
  border-radius: 4px
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.3)
  animation-name active
  animation-duration 0.25s
  animation-fill-mode afterwards
  animation-timing-function linear
  transition: opacity 0.2s,width 0.2s,height 0.2s,top 0.2s,left 0.2s;
  opacity 1

  &.minimize
    opacity 0
  &.dragging
    transition: none;

  .application-header-wrapper
    flex-basis: 36px
    position: relative
    background-color: #fff

  .application-body-wrapper
    flex: 1
    position: relative
    background-color: #fff
    padding: 5px
</style>
