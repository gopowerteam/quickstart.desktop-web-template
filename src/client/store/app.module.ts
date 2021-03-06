import { ApplicationList } from '@/config/application.config'

export interface IState {
    ready: boolean
    initialize: boolean
    applications: any[]
    applicationInstances: any[]
    desktopApps: any[]
    drawerVisible: boolean
}

export default {
    namespaced: true,
    state: (): IState => ({
        ready: false,
        initialize: true,
        applications: [],
        applicationInstances: [],
        desktopApps: [],
        drawerVisible: false
    }),
    mutations: {
        ready(state) {
            state.ready = true
            // 获取loader
            const loader = document.getElementById('loader')
            // 掩藏loader
            setTimeout(() => {
                loader?.classList.toggle('hidden')
            }, 500)
            // 删除loader
            setTimeout(() => {
                loader?.remove()
            }, 1700)
        },
        initialize(state, value) {
            state.initialize = value
        },
        // 打开应用
        openApp(state: any, name) {
            // 获取目标应用
            const target = state.applications.find(x => x.name === name)
            // 获取本地应用配置
            const app = ApplicationList.find(x => x.name === name)
            // 计算应用Index
            const index = Math.max(
                ...state.applicationInstances.map(x => x.index),
                0
            )
            // 检测非正常应用
            if (!target || !app) {
                return
            }

            // 创建应用对象
            const application = {
                name: name,
                id: Math.random().toString(32).slice(-6),
                minimize: false,
                maximize: target.maximize,
                root: app.root,
                icon: target.icon,
                title: target.title,
                index: index + 1,
                active: true,
                dragging: false,
                event: {
                    maximize: null,
                    index: null
                }
            }

            // 修改应用激活状态
            state.applicationInstances.forEach(x => (x.active = false))
            // 添加应用实例
            state.applicationInstances.push(application)
        },
        // 激活应用
        activeApp(state: any, id) {
            const index = Math.max(
                ...state.applicationInstances.map(x => x.index)
            )
            const app = state.applicationInstances.find(x => x.id === id)

            if (app.minimize) {
                app.minimize = !app.minimize
            }

            if (!app.active) {
                state.applicationInstances.forEach(x => (x.active = false))
                app.index = index + 1
                app.active = true
                app.event.index(app.index)
            }
        },
        // 关闭应用
        closeApp(state: any, id) {
            const index = state.applicationInstances.findIndex(x => x.id === id)
            state.applicationInstances.splice(index, 1)
        },
        // 最小化应用
        minimizeApp(state: any, id) {
            const app = state.applicationInstances.find(x => x.id === id)
            app.minimize = true
        },
        // 最大化应用
        maximizeApp(
            state: any,
            { id, value }: { id: number; value?: boolean }
        ) {
            const app = state.applicationInstances.find(x => x.id === id)
            app.maximize = value || !app.maximize

            if (app.event.maximize) {
                app.event.maximize(app.maximize)
            }
        },
        // 监听Index更新
        onAppIndexChange(state, { id, caller }) {
            const app = state.applicationInstances.find(x => x.id === id)
            app.event.index = caller
        },
        // 监听最大化状态更新
        onMaximizeChange(state: any, { id, caller }) {
            const app = state.applicationInstances.find(x => x.id === id)
            app.event.maximize = caller
        },
        updateAppList(state, apps) {
            state.applications = apps
        },
        updateAppDragging(state, id) {
            const app = state.applicationInstances.find(x => x.id === id)

            if (app) app.dragging = !app.dragging
        },
        logout(state) {
            state.current = {}
        },
        updateDesktopApps(state, apps) {
            state.desktopApps = apps
        },
        updateDrawerVisable(state, visible) {
            state.drawerVisible = visible
        }
    }
}
