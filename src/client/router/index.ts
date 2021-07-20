import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

import store from '@/store'
import { globalLaunch } from '@/bootstrap/boots/launch.boot'
import { routes } from './routes'

// 验证用户是否成功登录
const canUserAccess = () => {
    const result = !!store.state.user.current?.id
    return result
}

// 判断系统是否准备完毕
const canReadyAccess = async () => {
    const ready = !!store.state.app.ready
    if (!ready) {
        await globalLaunch().then(() => {
            if (canUserAccess()) {
                router.push('/workspace')
            }
        })
    }
}

const routerHistory = import.meta.env.SSR
    ? createMemoryHistory()
    : createWebHistory()

const router = createRouter({
    history: routerHistory,
    routes
})

// 系统初始化
router.beforeEach(canReadyAccess)

export default router
