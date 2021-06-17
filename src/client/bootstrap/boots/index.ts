import { App } from 'vue'
import { Router } from 'vue-router'
import { Store } from 'vuex'
import { componentsBoot } from './component.boot'
import httpBoot from './http.boot'
import { pluginBoot } from './plugin.boot'

export const boot = async ({
    app,
    store,
    router
}: {
    app: App<Element>
    store: Store<any>
    router: Router
}) => {
    // 网络初始化
    httpBoot(store, router)
    // 安装组件
    componentsBoot(app)
    // 安装插件
    pluginBoot(app)
}
