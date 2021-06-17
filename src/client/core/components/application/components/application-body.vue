<template lang="pug">
.application-body
    keep-alive
        component(:is='current.component' v-bind='current.props')
</template>

<script setup lang="ts">
import {
    computed,
    defineAsyncComponent,
    inject,
    shallowRef,
    triggerRef
} from 'vue'

const app = inject('app') as any
const onRouterChange = inject('onRouterChange') as any

const routes = shallowRef<any>([])

// 加载组件
const loadComponent = component => {
    return defineAsyncComponent(component)
}

// 初始化根组件
const RootComponent = loadComponent(app.root)
routes.value.push({
    component: RootComponent,
    porps: {}
})

// 获取当前组件
const current = computed(() => {
    const [route] = routes.value.slice(-1)
    return route
})

// 页面跳转处理
onRouterChange(
    (
        type: string,
        { component, props }: { component?: any; props?: any } = {}
    ) => {
        const actions = {
            push: () => {
                const Component = loadComponent(component)
                routes.value.push({
                    component: Component,
                    props
                })
                triggerRef(routes)
            },
            pop: () => {
                routes.value.pop()
                triggerRef(routes)
            }
        }

        actions[type]()
    }
)
</script>

<style lang="stylus" scoped>
.applicatoin-body
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0
  overflow: hidden
</style>
