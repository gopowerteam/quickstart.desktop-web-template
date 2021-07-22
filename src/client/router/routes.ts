import { RouteRecordRaw } from 'vue-router'
import store from '@/store'
import { userLaunch } from '@/bootstrap/boots/launch.boot'

/**
 * 用户权限验证
 * @returns
 */
const canUserAccess = () => {
    const result = !!store.state.user.token
    return result
}

/**
 * 系统状态验证
 */
const canSystemAccess = () => {
    return store.state.app.initialize
}

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/workspace'
    },
    {
        name: 'welcome',
        path: '/welcome',
        component: () => import('@/pages/welcome/welcome.vue')
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('@/pages/login/login.vue'),
        beforeEnter: async () => {
            const canAccess = await canUserAccess()
            const systemAccess = await canSystemAccess()

            if (canAccess) return '/workspace'
            if (!systemAccess) return '/welcome'
        }
    },
    {
        name: 'worksapce',
        path: '/workspace',
        component: () => import('@/pages/workspace/workspace.vue'),
        beforeEnter: async () => {
            const userAccess = await canUserAccess()
            const systemAccess = await canSystemAccess()

            if (!systemAccess) return '/welcome'
            if (!userAccess) return '/login'

            return await userLaunch()
        }
    }
]
